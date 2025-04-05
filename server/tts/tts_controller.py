import os
import json
import re
import numpy as np
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from scipy.io.wavfile import write
from speechbrain.inference import FastSpeech2, HIFIGAN
import easyocr
from PIL import Image
import io
from users.user_model import User  # Import the User model
import uuid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .TTSUsage import TTSUsage
from django.contrib.auth.decorators import login_required
import sys

# File path for storing the CSV file
CSV_FILE_PATH = "./tts/data.csv"
 

# Load existing data or create a new DataFrame
if os.path.exists(CSV_FILE_PATH):
    main_df = pd.read_csv(CSV_FILE_PATH)
else:
    main_df = pd.DataFrame(columns=["Sentence", "Mp3_Path"])

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Load the TTS models once
fastspeech2 = FastSpeech2.from_hparams(source="speechbrain/tts-fastspeech2-ljspeech", savedir="./tts/pretrained_models/tts-fastspeech2-ljspeech")
hifi_gan = HIFIGAN.from_hparams(source="speechbrain/tts-hifigan-ljspeech", savedir="./tts/pretrained_models/tts-hifigan-ljspeech")

print("########## MOODELS LOADED ############")
@permission_classes([AllowAny])
@csrf_exempt
def generate_audio_from_text(sentence):
    """
    Generate TTS audio for the given sentence and save it as a WAV file.
    
    Returns:
    str: File path of the saved audio.
    """
    global main_df
    os.makedirs('./tts/media', exist_ok=True)
    # Check if sentence already exists in DataFrame
    existing_row = main_df[main_df['Sentence'] == sentence]
    if not existing_row.empty:
        print(f"Found in {existing_row.iloc[0]['Mp3_Path']}")
        print(f"Sentence '{sentence}' already exists. Using existing audio file.")
        return existing_row.iloc[0]['Mp3_Path']
 
    # Generate mel spectrogram
    sentence = sentence.replace("_", " ")
    print(f'*********** Text: ${sentence}')
    mel_output = fastspeech2.encode_text([sentence], pace=1.3, pitch_rate=1.0, energy_rate=1.1)[0]

    # Generate waveform
    waveform = hifi_gan.decode_batch(spectrogram=mel_output, hop_len=1)

    # Convert to numpy array
    audio_data = waveform.squeeze().cpu().numpy()
    audio_data = (audio_data * 32767).astype(np.int16)

    # Define file path
    file_name = sentence.replace(' ', '_') + '.wav'
    file_path = f'tts/media/{file_name}'  # Save directly in the media folder

    # Save the audio file
    write(file_path, 22050, audio_data)

    # Add to DataFrame and save to CSV
    new_row = pd.DataFrame({'Sentence': [sentence], 'Mp3_Path': [file_path]})
    main_df = pd.concat([main_df, new_row], ignore_index=True)
    main_df.to_csv(CSV_FILE_PATH, index=False)

    print(f"Generated audio for: '{sentence}' → {file_path}")
    return file_path

# Modified to add the email information
@permission_classes([AllowAny])
@csrf_exempt
def process_text(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            text = data.get("text", "").strip().lower()
            userId = data.get("userId")  # Retrieve email from session
            user = User.objects.get(_id=uuid.UUID(userId))  

            if not text:
                return JsonResponse({"error": "No text provided"}, status=400)
            if not userId:
                return JsonResponse({"error": "User not logged in"}, status=401)

            print("Starting normal process")
            sentences = split_sentences(text)
            new_entries = []
            for sentence in sentences:
                file_path = generate_audio_from_text(sentence)

                # Check if the combination of sentence and userId already exists in MongoDB
                existing_row = TTSUsage.objects.filter(sentence=sentence, userId=userId).first()
                print(existing_row)

                if existing_row:
                    print(f"Sentence already exists for this user: {existing_row.sentence}")
                    file_path = existing_row.mp3_path  # Use the existing MP3 path
                else:
                    # Generate the audio if the combination of sentence and userId doesn't exist
                    file_path = generate_audio_from_text(sentence)

                    # Store usage in MongoDB
                    user = TTSUsage.objects.create(userId=user, sentence=sentence, mp3_path=file_path)

                new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})

            return JsonResponse({"message": "Processing completed", "data": new_entries})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@permission_classes([AllowAny])
@csrf_exempt
def process_image(request):
    """
    API endpoint to process an uploaded image, extract text using OCR, and generate TTS.
    """
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            print("Received image for processing")
            
            # Retrieve userId from form data
            userId = request.POST.get("userId")  # Extract userId from form data
            if not userId:
                return JsonResponse({"error": "UserId is missing"}, status=400)

            # Fetch the user from the database
            user = User.objects.get(_id=uuid.UUID(userId))  # Fetch user by UUID
            print(f"User: {user}")

            # Handle image processing
            image_file = request.FILES['image']
            image = Image.open(io.BytesIO(image_file.read())).convert('L')

            # Extract text using OCR
            result = reader.readtext(np.array(image))
            text = " ".join([word[1] for word in result]).strip().lower()
            
            if not text:
                return JsonResponse({'error': 'No readable text found in image'}, status=400)

            print(f"OCR Extracted Text: {text}")

            # Process extracted text
            new_entries = []
            sentences = split_sentences(text)
            print(f"Sentences: {sentences}")

            for sentence in sentences:
                # Check if the combination of sentence and userId already exists in MongoDB
                existing_row = TTSUsage.objects.filter(sentence=sentence, userId=userId).first()
                print(f"Checking existing row: {existing_row}")

                if existing_row:
                    # If sentence already exists for this user, use the existing MP3 path
                    print(f"Sentence already exists for this user: {existing_row.sentence}")
                    file_path = existing_row.mp3_path
                else:
                    # Generate the audio if the combination of sentence and userId doesn't exist
                    file_path = generate_audio_from_text(sentence)

                    # Store usage in MongoDB
                    TTSUsage.objects.create(userId=user, sentence=sentence, mp3_path=file_path)

                new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})

            return JsonResponse({"message": "Processing completed", "data": new_entries, "word": text})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request or missing image file'}, status=400)


@csrf_exempt
def list_processed(request):
    """
    List all the processed sentences and their corresponding MP3 paths.
    """
    if not main_df.empty:
        data = main_df.to_dict(orient="records")
        return JsonResponse({'message': 'Processed sentences', 'data': data}, status=200)
    else:
        return JsonResponse({'message': 'No processed sentences found'}, status=200)

import re

def split_sentences(text):
    # Split the text into sentences based on punctuation
    sentences = [s.strip() for s in re.split(r'(?<=[.!?;])\s+', text) if s.strip()]
    
    result = []
    temp_sentence = None

    # Loop through the sentences
    for i in range(len(sentences)):
        sentence = sentences[i]

        # Merge short sentences with the next one (if they have less than 6 words)
        if len(sentence.split()) < 6:
            if temp_sentence:
                temp_sentence += " " + sentence  # Add a space to make it readable
            else:
                temp_sentence = sentence
        else:
            # If a temporary sentence exists, add it to the result
            if temp_sentence:
                result.append(temp_sentence)
                temp_sentence = None
            result.append(sentence)

    # If there's a temp_sentence left at the end (for very short sentences)
    if temp_sentence:
        # If the last result sentence is also short, merge the two
        if len(result) > 1 and len(result[-1].split()) < 6:
            result[-1] += " " + temp_sentence  # Add space when merging
        else:
            result.append(temp_sentence)

    # Further cleanup, handling case where sentences end with unwanted fragments (e.g., dates)
    merged_result = []
    for i in range(len(result)):
        # Check if it's a short fragment that could be a date or file part
        if i > 0 and len(result[i].split()) < 3 and result[i-1][-1] not in '.!?':  # e.g., "2022"
            merged_result[-1] += " " + result[i]  # Merge with previous sentence and add space
        else:
            merged_result.append(result[i])

    # Clean the sentences for file name compatibility
    cleaned_result = []
    for sentence in merged_result:
        # Remove non-alphanumeric characters (except spaces and underscores)
        cleaned_sentence = re.sub(r'[^a-zA-Z0-9\s_]', '', sentence)
        # Replace spaces with underscores for file name compatibility
        cleaned_sentence = cleaned_sentence.replace(" ", "_")
        cleaned_result.append(cleaned_sentence)

    return cleaned_result




# updating data.csv file according the media avaialble 
def run_once():
    media_folder_path= './tts/media'
    os.makedirs(media_folder_path, exist_ok=True)
    if os.path.exists(CSV_FILE_PATH):
        main_df = pd.read_csv(CSV_FILE_PATH)
    else:
        main_df = pd.DataFrame(columns=["Sentence", "Mp3_Path"])
    try:
        x = main_df['Mp3_Path'].str.split('/').str[-1].str.lower() 
        contents = [c.lower() for c in os.listdir(media_folder_path)]
        
        indices_to_drop = []
        
        for index, filename in x.items():
            if filename not in contents:
                indices_to_drop.append(index)

        if indices_to_drop:
            main_df.drop(indices_to_drop, inplace=True)
            main_df.to_csv(CSV_FILE_PATH, index=False)
            
        else:
            print("No rows found to delete.")
            
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        print(exc_type, fname, exc_tb.tb_lineno, exc_obj)
        print(e)
    return 0

run_once()