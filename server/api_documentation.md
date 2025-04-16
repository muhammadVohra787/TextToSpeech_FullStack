# TTS App API Documentation

This document provides detailed information about all the available API endpoints in the TTS (Text-to-Speech) application.

## Base URLs

- API Base URL: `/api`
- User API: `/api/users`
- TTS API: `/api/tts`

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header of your requests:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained after successful login.

## Middleware

The application uses the following middleware for security:

1. **isAuthenticated**: Verifies that a valid JWT token is included in the request header.
2. **isAdmin**: Checks if the authenticated user has admin privileges.

---

## User API

### 1. Create User

**Endpoint:** `POST /api/users/create_user`

**Description:** Registers a new user.

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "securePassword123",
  "sq1": "What is your mother's maiden name?",
  "sa1": "Smith",
  "sq2": "What city were you born in?",
  "sa2": "New York",
  "admin": false
}
```

**Response:** 
- Success (201):
```json
{
  "message": "User registered",
  "success": true
}
```
- Error (400): 
```json
{
  "message": "User with this email already exists"
}
```

### 2. User Login

**Endpoint:** `POST /api/users/sign_in`

**Description:** Authenticates a user and returns a JWT token.

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
- Success (200):
```json
{
  "token": "jwt_token_here",
  "user_id": "user_id_here",
  "email": "user@example.com",
  "admin": false,
  "success": true
}
```
- Error (401):
```json
{
  "message": "Invalid credentials"
}
```

### 3. Forgot Password

**Endpoint:** `POST /api/users/forgot_password`

**Description:** Allows users to reset their password using security questions.

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "sq1": "What is your mother's maiden name?",
  "sa1": "Smith",
  "sq2": "What city were you born in?",
  "sa2": "New York",
  "password": "newSecurePassword123"
}
```

**Response:**
- Success (201):
```json
{
  "message": "Password changed",
  "success": true
}
```
- Error (404):
```json
{
  "message": "Questions do not match",
  "success": false
}
```

### 4. Get Security Questions by Email

**Endpoint:** `POST /api/users/get_questions_by_email`

**Description:** Retrieves security questions associated with an email address.

**Authentication:** None

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
- Success (200):
```json
{
  "sq1": "What is your mother's maiden name?",
  "sq2": "What city were you born in?"
}
```
- Error (404):
```json
{
  "message": "Email does not exist"
}
```

### 5. Reset Password

**Endpoint:** `POST /api/users/reset_password`

**Description:** Allows authenticated users to reset their password.

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "user_id_here",
  "email": "user@example.com",
  "old_password": "oldSecurePassword123",
  "new_password": "newSecurePassword123"
}
```

**Response:**
- Success (201):
```json
{
  "message": "Password changed",
  "success": true
}
```
- Error (401):
```json
{
  "message": "Invalid credentials, passwords do not match"
}
```

### 6. Get User

**Endpoint:** `POST /api/users/get_user`

**Description:** Retrieves a user's profile information.

**Authentication:** None

**Request Body:**
```json
{
  "userId": "user_id_here"
}
```

**Response:**
- Success (200):
```json
{
  "user": {
    "_id": "user_id_here",
    "fullName": "John Doe",
    "email": "user@example.com",
    "sq1": "What is your mother's maiden name?",
    "sa1": "Smith",
    "sq2": "What city were you born in?",
    "sa2": "New York",
    "admin": false
  }
}
```
- Error (404):
```json
{
  "message": "User not found"
}
```

### 7. Update User

**Endpoint:** `POST /api/users/update_user`

**Description:** Updates a user's profile information.

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "user_id_here",
  "fullName": "Updated Name",
  "email": "updated@example.com"
}
```

**Response:**
- Success (200):
```json
{
  "message": "User updated successfully",
  "success": true
}
```
- Error (404):
```json
{
  "message": "User not found"
}
```

### 8. Get All Users

**Endpoint:** `GET /api/users/get_users`

**Description:** Retrieves a list of all users.

**Authentication:** Required

**Response:**
- Success (200): Array of user objects

### 9. Get User Recordings

**Endpoint:** `POST /api/users/get_user_recordings`

**Description:** Retrieves all TTS recordings associated with a user.

**Authentication:** None

**Request Body:**
```json
{
  "userId": "user_id_here"
}
```

**Response:**
- Success (200):
```json
{
  "recordings": {
    "reference_id_1": {
      "sentence": "Example sentence",
      "paths": ["path/to/audio1.wav", "path/to/audio2.wav"]
    },
    "reference_id_2": {
      "sentence": "Another example",
      "paths": ["path/to/audio3.wav"]
    }
  }
}
```
- Error (404):
```json
{
  "message": "User not found"
}
```

### 10. Delete Recording

**Endpoint:** `POST /api/users/delete_recording`

**Description:** Deletes a specific user recording.

**Authentication:** Required

**Request Body:**
```json
{
  "mp3_path": "path/to/recording.wav"
}
```

**Response:**
- Success (200):
```json
{
  "message": "Recording deleted successfully"
}
```

### 11. Get All Users (Admin)

**Endpoint:** `GET /api/users/get_all_users`

**Description:** Retrieves a list of all users with usage statistics.

**Authentication:** Required (Admin only)

**Response:**
- Success (200): Array of user objects with usage data

### 12. Delete User (Admin)

**Endpoint:** `POST /api/users/delete_user`

**Description:** Deletes a user account and all associated recordings.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "userId": "user_id_to_delete"
}
```

**Response:**
- Success (200):
```json
{
  "message": "User deleted successfully"
}
```

### 13. Get Usage Statistics

**Endpoint:** `POST /api/users/get_usage`

**Description:** Retrieves usage statistics for a specific user.

**Authentication:** None

**Request Body:**
```json
{
  "userId": "user_id_here"
}
```

**Response:**
- Success (200):
```json
{
  "usage": {
    "total_recordings": 10,
    "usage_by_date": {
      "2023-01-01": 2,
      "2023-01-02": 8
    }
  }
}
```

---

## TTS API

### 1. Process Text

**Endpoint:** `POST /api/tts/process_text/`

**Description:** Converts text input to speech and generates audio files.

**Authentication:** None (but requires userId)

**Request Body:**
```json
{
  "text": "This is the text that will be converted to speech.",
  "userId": "user_id_here"
}
```

**Response:**
- Success (200):
```json
{
  "message": "Processing completed",
  "data": [
    {
      "Sentence": "This_is_the_text_that_will_be_converted_to_speech",
      "Mp3_Path": "tts/media/This_is_the_text_that_will_be_converted_to_speech.wav"
    }
  ]
}
```
- Error (400):
```json
{
  "error": "No text provided"
}
```

### 2. Process Image

**Endpoint:** `POST /api/tts/process_image/`

**Description:** Extracts text from an image using OCR, enhances it using AI, and converts it to speech.

**Authentication:** None (but requires userId)

**Request Body:**
- Form data with:
  - `image`: Image file
  - `userId`: User ID

**Response:**
- Success (200):
```json
{
  "message": "Processing completed",
  "data": [
    {
      "Sentence": "Text_extracted_from_the_image",
      "Mp3_Path": "tts/media/Text_extracted_from_the_image.wav"
    }
  ],
  "word": "Text extracted from the image"
}
```
- Error (400):
```json
{
  "error": "No readable text found in image"
}
```

### 3. List Processed

**Endpoint:** `GET /api/tts/list_processed/`

**Description:** Retrieves a list of all processed text-to-speech conversions.

**Authentication:** None

**Response:**
- Success (200):
```json
{
  "message": "Processed sentences",
  "data": [
    {
      "Sentence": "Example_sentence",
      "Mp3_Path": "tts/media/Example_sentence.wav"
    }
  ]
}
```

---

## Data Models

### User Model

```
User:
  _id: UUID (primary key)
  fullName: String
  email: String (unique)
  password: String (hashed)
  sq1: String (security question 1)
  sa1: String (security answer 1)
  sq2: String (security question 2)
  sa2: String (security answer 2)
  admin: Boolean
```

### TTSUsage Model

```
TTSUsage:
  _id: UUID (primary key)
  reference_id: UUID
  userId: Foreign Key (User)
  sentence: String (the text converted to speech)
  mp3_path: String (path to the generated audio file)
  created_at: Date
```

---

## Error Codes

- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **400**: Bad Request - Invalid input or missing fields
- **401**: Unauthorized - Authentication required or invalid credentials
- **403**: Forbidden - User does not have permission to access the resource
- **404**: Not Found - Resource not found
- **405**: Method Not Allowed - HTTP method not allowed for this endpoint
- **500**: Internal Server Error - Server-side error

---

## Notes

- All POST requests should include Content-Type: application/json in the headers (except for process_image which uses multipart/form-data)
- Audio files are stored in the server/tts/media directory
- Security questions and answers are case-sensitive
- The API uses JWT (JSON Web Tokens) for authentication with a 2-day expiration 