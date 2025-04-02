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

# @permission_classes([AllowAny])
# @csrf_exempt
# def process_text(request):
#     """
#     API endpoint to process text and generate TTS audio.
#     """
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             text = data.get('text', '').strip()

#             if not text:
#                 return JsonResponse({'error': 'No text provided'}, status=400)

#             # Split text into sentences
#             sentences = split_sentences(text)
#             print(sentences)
#             # Process sentences
#             new_entries = []
#             for sentence in sentences:
#                 # sentence = sentence.lower()
#                 file_path = generate_audio_from_text(sentence)
#                 new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})

#             return JsonResponse({'message': 'Processing completed', 'data': new_entries})

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)


# Modified to add the email information
@permission_classes([AllowAny])
@csrf_exempt
def process_text(request):
    if request.method == "POST":
        try:
            print("did this at line 116")
            print(f"Session Data: {request.session.items()}")
            print("Request body:", request.body)  # Debugging the raw body
            
            data = json.loads(request.body)
            text = data.get("text", "").strip()
            userId = data.get("userId")  # Retrieve email from session
            user = User.objects.get(_id=uuid.UUID(userId))  
            print("did this at line 120")

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


# @permission_classes([AllowAny])
# @csrf_exempt
# def process_image(request):
#     """
#     API endpoint to process an uploaded image, extract text using OCR, and generate TTS.
#     """
#     if request.method == 'POST' and request.FILES.get('image'):
#         try:
#             image_file = request.FILES['image']
#             image = Image.open(io.BytesIO(image_file.read())).convert('L')

#             # Extract text using OCR
#             result = reader.readtext(np.array(image))
#             text = " ".join([word[1] for word in result]).strip()

#             if not text:
#                 return JsonResponse({'error': 'No readable text found in image'}, status=400)

#             print(f"OCR Extracted Text: {text}")

#             # Process extracted text
#             new_entries = []
#             sentences = split_sentences(text)
#             print(sentences)
#             for sentence in sentences:
#                 file_path = generate_audio_from_text(sentence)
#                 new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})

#             return JsonResponse({'message': 'Processing completed', 'data': new_entries})

#         except Exception as e:
#             print(e)
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request or missing image file'}, status=400)

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
            text = " ".join([word[1] for word in result]).strip()

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

            return JsonResponse({"message": "Processing completed", "data": new_entries})

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

def split_sentences(text):
    sentences = [s.strip() for s in re.split(r'[.!?,;]', text) if s.strip()]
    
    result = []
    temp_sentence = None

    for i in range(len(sentences)):
        sentence = sentences[i]

        if len(sentence.split()) < 6:
            # If it's short, merge it with the next sentence
            if temp_sentence:
                temp_sentence += " " + sentence
            else:
                temp_sentence = sentence
        else:
            # If it's long enough, add temp_sentence (if any) and the current sentence
            if temp_sentence:
                result.append(temp_sentence)
                temp_sentence = None
            result.append(sentence)

    # Append any remaining temp_sentence
    if temp_sentence:
        result.append(temp_sentence)

    return result