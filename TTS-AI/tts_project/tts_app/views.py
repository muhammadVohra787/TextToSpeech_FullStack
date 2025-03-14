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

# File path for storing the CSV file
CSV_FILE_PATH = "data.csv"

# Ensure the directory for saving audio exists
os.makedirs('generated_audio', exist_ok=True)

# Load existing data or create a new DataFrame
if os.path.exists(CSV_FILE_PATH):
    main_df = pd.read_csv(CSV_FILE_PATH)
else:
    main_df = pd.DataFrame(columns=["Sentence", "Mp3_Path"])

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Load the TTS models once
fastspeech2 = FastSpeech2.from_hparams(source="speechbrain/tts-fastspeech2-ljspeech", savedir="pretrained_models/tts-fastspeech2-ljspeech")
hifi_gan = HIFIGAN.from_hparams(source="speechbrain/tts-hifigan-ljspeech", savedir="pretrained_models/tts-hifigan-ljspeech")


def generate_audio_from_text(sentence):
    """
    Generate TTS audio for the given sentence and save it as a WAV file.
    
    Returns:
    str: File path of the saved audio.
    """
    global main_df

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
    file_path = f'media/{file_name}'  # Save directly in the media folder

    # Save the audio file
    write(file_path, 22050, audio_data)

    # Add to DataFrame and save to CSV
    new_row = pd.DataFrame({'Sentence': [sentence], 'Mp3_Path': [file_path]})
    main_df = pd.concat([main_df, new_row], ignore_index=True)
    main_df.to_csv(CSV_FILE_PATH, index=False)

    print(f"Generated audio for: '{sentence}' → {file_path}")
    return file_path


@csrf_exempt
def process_text(request):
    """
    API endpoint to process text and generate TTS audio.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '').strip()

            if not text:
                return JsonResponse({'error': 'No text provided'}, status=400)

            # Split text into sentences
            sentences = [s.strip() for s in re.split(r'[.!?,;]', text) if s.strip()]

            # Process sentences
            new_entries = []
            for sentence in sentences:
                # sentence = sentence.lower()
                file_path = generate_audio_from_text(sentence)
                new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})

            return JsonResponse({'message': 'Processing completed', 'data': new_entries})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def process_image(request):
    """
    API endpoint to process an uploaded image, extract text using OCR, and generate TTS.
    """
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            image_file = request.FILES['image']
            image = Image.open(io.BytesIO(image_file.read()))

            # Extract text using OCR
            result = reader.readtext(np.array(image))
            text = " ".join([word[1] for word in result]).strip()

            if not text:
                return JsonResponse({'error': 'No readable text found in image'}, status=400)

            print(f"OCR Extracted Text: {text}")

            # Process extracted text
            sentences = [s.strip() for s in re.split(r'[.!?,;]', text) if s.strip()]
            new_entries = []

            for sentence in sentences:
                file_path = generate_audio_from_text(sentence)
                new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})

            return JsonResponse({'message': 'Processing completed', 'data': new_entries})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request or missing image file'}, status=400)


def list_processed(request):
    """
    List all the processed sentences and their corresponding MP3 paths.
    """
    if not main_df.empty:
        data = main_df.to_dict(orient="records")
        return JsonResponse({'message': 'Processed sentences', 'data': data}, status=200)
    else:
        return JsonResponse({'message': 'No processed sentences found'}, status=200)



# import os
# import json
# import re
# import numpy as np
# import pandas as pd
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from scipy.io.wavfile import write
# import easyocr
# from PIL import Image
# import io
# from transformers import pipeline

# # File path for storing the CSV file
# CSV_FILE_PATH = "data.csv"

# # Ensure the directory for saving audio exists
# os.makedirs('generated_audio', exist_ok=True)

# # Load existing data or create a new DataFrame
# if os.path.exists(CSV_FILE_PATH):
#     main_df = pd.read_csv(CSV_FILE_PATH)
# else:
#     main_df = pd.DataFrame(columns=["Sentence", "Mp3_Path"])

# # Initialize EasyOCR reader
# reader = easyocr.Reader(['en'])

# # Load TTS models from Hugging Face (Note: No local saving or cache)
# def load_models():
#     # Using Hugging Face directly for text-to-speech
#     # You can use any appropriate Hugging Face models, but here I am using a Hugging Face TTS pipeline
#     print("Models loaded directly from HuggingFace")
#     fastspeech2 = pipeline(task="text-to-speech", model="speechbrain/tts-fastspeech2-ljspeech")
#     hifi_gan = pipeline(task="text-to-speech", model="speechbrain/tts-hifigan-ljspeech")

#     return fastspeech2, hifi_gan

# # Generate audio without saving the model locally
# def generate_audio_from_text(sentence):
#     """
#     Generate TTS audio for the given sentence and save it as a WAV file.
    
#     Returns:
#     str: File path of the saved audio.
#     """
#     global main_df

#     # Check if sentence already exists in DataFrame
#     existing_row = main_df[main_df['Sentence'] == sentence]
#     if not existing_row.empty:
#         print(f"Found in {existing_row.iloc[0]['Mp3_Path']}")
#         print(f"Sentence '{sentence}' already exists. Using existing audio file.")
#         return existing_row.iloc[0]['Mp3_Path']

#     # Load models from Hugging Face each time to avoid caching them locally
#     fastspeech2, hifi_gan = load_models()

#     # Generate mel spectrogram
#     mel_output = fastspeech2(sentence)

#     # Generate waveform
#     waveform = hifi_gan.decode_batch(spectrogram=mel_output, hop_len=1)

#     # Convert to numpy array
#     audio_data = waveform.squeeze().cpu().numpy()
#     audio_data = (audio_data * 32767).astype(np.int16)

#     # Define file path
#     file_name = sentence.replace(' ', '_') + '.wav'
#     file_path = f'media/{file_name}'  # Save directly in the media folder

#     # Save the audio file
#     write(file_path, 22050, audio_data)

#     # Add to DataFrame and save to CSV
#     new_row = pd.DataFrame({'Sentence': [sentence], 'Mp3_Path': [file_path]})
#     main_df = pd.concat([main_df, new_row], ignore_index=True)
#     main_df.to_csv(CSV_FILE_PATH, index=False)

#     print(f"Generated audio for: '{sentence}' → {file_path}")
#     return file_path

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
#             sentences = [s.strip() for s in re.split(r'[.!?,;]', text) if s.strip()]

#             # Process sentences
#             new_entries = []
#             for sentence in sentences:
#                 file_path = generate_audio_from_text(sentence)
#                 new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})

#             return JsonResponse({'message': 'Processing completed', 'data': new_entries})

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)


# @csrf_exempt
# def process_image(request):
#     """
#     API endpoint to process an uploaded image, extract text using OCR, and generate TTS.
#     """
#     if request.method == 'POST' and request.FILES.get('image'):
#         try:
#             image_file = request.FILES['image']
#             image = Image.open(io.BytesIO(image_file.read()))

#             # Extract text using OCR
#             result = reader.readtext(np.array(image))
#             text = " ".join([word[1] for word in result]).strip()

#             if not text:
#                 return JsonResponse({'error': 'No readable text found in image'}, status=400)

#             print(f"OCR Extracted Text: {text}")

#             # Process extracted text
#             sentences = [s.strip() for s in re.split(r'[.!?,;]', text) if s.strip()]
#             new_entries = []

#             for sentence in sentences:
#                 file_path = generate_audio_from_text(sentence)
#                 new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})

#             return JsonResponse({'message': 'Processing completed', 'data': new_entries})

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request or missing image file'}, status=400)


# def list_processed(request):
#     """
#     List all the processed sentences and their corresponding MP3 paths.
#     """
#     if not main_df.empty:
#         data = main_df.to_dict(orient="records")
#         return JsonResponse({'message': 'Processed sentences', 'data': data}, status=200)
#     else:
#         return JsonResponse({'message': 'No processed sentences found'}, status=200)
