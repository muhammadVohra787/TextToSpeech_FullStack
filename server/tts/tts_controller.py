import os
import json
import re
import numpy as np
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from PIL import Image
import easyocr
import uuid
import io
import sys
from gtts import gTTS
from users.user_model import User
from .TTSUsage import TTSUsage
from google import genai
import sys
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
client = genai.Client(api_key=api_key)
CSV_FILE_PATH = "./tts/data.csv"
MEDIA_FOLDER = './tts/media'

# Load or create CSV
if os.path.exists(CSV_FILE_PATH):
    main_df = pd.read_csv(CSV_FILE_PATH)
else:
    main_df = pd.DataFrame(columns=["Sentence", "Mp3_Path"])

reader = easyocr.Reader(['en'])
print("########## MODELS LOADED ############")

@permission_classes([AllowAny])
@csrf_exempt
def generate_audio_from_text(sentence):
    global main_df
    os.makedirs(MEDIA_FOLDER, exist_ok=True)

    sentence = sentence.replace("_", " ")
    file_name = sentence.replace(' ', '_') + '.wav'
    file_path = f'{MEDIA_FOLDER}/{file_name}'

    if not os.path.exists(file_path):
        tts = gTTS(text=sentence, lang="en")
        tts.save(file_path)
        print(f"Generated audio for: '{sentence}' → {file_path}")

    if sentence not in main_df['Sentence'].values:
        new_row = pd.DataFrame({'Sentence': [sentence], 'Mp3_Path': [file_path]})
        main_df = pd.concat([main_df, new_row], ignore_index=True)
        main_df.to_csv(CSV_FILE_PATH, index=False)

    return file_path

@permission_classes([AllowAny])
@csrf_exempt
def process_text(request):
    if request.method == "POST":
        try:
            sentence_id = uuid.uuid4()
            data = json.loads(request.body)
            text = data.get("text", "").strip().lower()
            userId = data.get("userId")

            if not text:
                return JsonResponse({"error": "No text provided"}, status=400)
            if not userId:
                return JsonResponse({"error": "User ID is missing"}, status=400)

            user = User.objects.get(_id=uuid.UUID(userId))
            sentences = split_sentences(text)
            new_entries = []

            for sentence in sentences:
                file_path = generate_audio_from_text(sentence)
                TTSUsage.objects.create(userId=user, sentence=text, mp3_path=file_path, reference_id=sentence_id)
                new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})
            
            return JsonResponse({"message": "Processing completed", "data": new_entries})
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@permission_classes([AllowAny])
@csrf_exempt
def process_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            sentence_id = uuid.uuid4()
            userId = request.POST.get("userId")
            if not userId:
                return JsonResponse({"error": "UserId is missing"}, status=400)

            user = User.objects.get(_id=uuid.UUID(userId))
            image_file = request.FILES['image']
            image = Image.open(io.BytesIO(image_file.read())).convert('L')

            result = reader.readtext(np.array(image))
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=f"Clean up this OCR text: {result}. Remove extra punctuation (not all), correct spelling errors, remove invalid characters, return cleaned text only."
            )
            text = response.text.strip().replace("\n", " ")
            if not text:
                return JsonResponse({'error': 'No readable text found in image'}, status=400)

            sentences = split_sentences(text)
            new_entries = []

            for sentence in sentences:
                file_path = generate_audio_from_text(sentence)
                
                new_entries.append({"Sentence": sentence, "Mp3_Path": file_path})
            TTSUsage.objects.create(userId=user, sentence=text, mp3_path=None, reference_id=sentence_id)
            return JsonResponse({"message": "Processing completed", "data": new_entries, "word": text})
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request or missing image file'}, status=400)

@csrf_exempt
def list_processed(request):
    if not main_df.empty:
        data = main_df.to_dict(orient="records")
        return JsonResponse({'message': 'Processed sentences', 'data': data}, status=200)
    else:
        return JsonResponse({'message': 'No processed sentences found'}, status=200)

def split_sentences(text):
    sentences = [s.strip() for s in re.split(r'(?<=[.!?;])\s+', text) if s.strip()]
    result = []
    temp_sentence = None
    max_sentence_length = 200

    for sentence in sentences:
        if len(sentence.split()) < 6:
            if temp_sentence:
                temp_sentence += " " + sentence
            else:
                temp_sentence = sentence
        else:
            if temp_sentence:
                result.append(temp_sentence)
                temp_sentence = None
            result.append(sentence)

    if temp_sentence:
        if len(result) > 1 and len(result[-1].split()) < 6:
            result[-1] += " " + temp_sentence
        else:
            result.append(temp_sentence)

    merged_result = []
    for i in range(len(result)):
        if i > 0 and len(result[i].split()) < 3 and result[i-1][-1] not in '.!?':
            merged_result[-1] += " " + result[i]
        else:
            merged_result.append(result[i])

    split_result = []
    for sentence in merged_result:
        if len(sentence) > max_sentence_length:
            chunks = [sentence[i:i+max_sentence_length] for i in range(0, len(sentence), max_sentence_length)]
            split_result.extend(chunks)
        else:
            split_result.append(sentence)

    cleaned_result = []
    for sentence in split_result:
        cleaned_sentence = re.sub(r'[^a-zA-Z0-9\s_]', '', sentence)
        cleaned_sentence = cleaned_sentence.replace(" ", "_")
        cleaned_result.append(cleaned_sentence)

    return cleaned_result

def run_once():
    os.makedirs(MEDIA_FOLDER, exist_ok=True)
    if os.path.exists(CSV_FILE_PATH):
        main_df = pd.read_csv(CSV_FILE_PATH)
    else:
        main_df = pd.DataFrame(columns=["Sentence", "Mp3_Path"])

    try:
        media_files = [f.lower() for f in os.listdir(MEDIA_FOLDER)]
        existing_files = main_df['Mp3_Path'].str.split('/').str[-1].str.lower()

        indices_to_drop = [idx for idx, f in existing_files.items() if f not in media_files]

        if indices_to_drop:
            main_df.drop(indices_to_drop, inplace=True)
            main_df.to_csv(CSV_FILE_PATH, index=False)
        else:
            print("No mismatches found between CSV and media folder.")
    except Exception as e:
        print("Error during sync:", e)

run_once()
