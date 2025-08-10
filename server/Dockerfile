# Use official Python image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 10000

# Set working directory
WORKDIR /app

# Install system dependencies (for Pillow, etc)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY . /app/

# Collect static files (optional, if you use static files)
RUN python manage.py collectstatic --noinput

# Expose the port Gunicorn will use
EXPOSE 10000

# Run the Gunicorn server
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:10000", "--timeout", "200"]
