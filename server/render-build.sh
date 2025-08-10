#!/bin/bash

# Update package list and install Tesseract
apt-get update
apt-get install -y tesseract-ocr

# Install Python dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput
