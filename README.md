# TextToSpeech Full-Stack App  
Modern full-stack application for converting text and images to natural-sounding speech. Includes protected authentication (sign in, sign up, forgot password) and separate dashboards for users and admins.

## Screenshots

<p align="center">
  <b>Landing Page</b><br/>
  <img width="1094" alt="Landing Page" src="https://github.com/user-attachments/assets/e68a98a5-59bf-4ebb-9b69-b576b1b9cb07" />
</p>

<p align="center">
  <b>Text to Speech</b><br/>
  <img width="1094" alt="Text to Speech" src="https://github.com/user-attachments/assets/5e54b23a-d540-4198-9912-d3190628f884" />
</p>

<p align="center">
  <b>Image to Speech (OCR)</b><br/>
  <img width="1314" alt="Image to Speech (OCR)" src="https://github.com/user-attachments/assets/9403805c-612c-4880-8960-79a8ca609125" />
</p>

## Backend runtime
Python 3.12.3
## **Setup and Run the Server**  

0. **Start your MongoDB localhost** 
    ```sh
   mongod
   ```

1. **Navigate to the server directory**  
   ```sh
   cd server/
   ```

2. **Create and activate a virtual environment**  
   - **Windows (PowerShell)**  
     ```sh
     python -m venv venv
     venv\Scripts\activate
     ```
   - **Mac/Linux**  
     ```sh
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**  
   ```sh
   pip install -r requirements.txt
   ```
   
4. **Run the Django development server with makemigrations**  
   ```sh
   python manage.py makemigrations
   ```
   
5. **Run the Django development server**  
   ```sh
   python manage.py runserver
   ```

✅ The Django API should now be running at **http://localhost:8000** 🚀

If you're still encountering any error, run the VS Code as administrator
```

```

## Setup and Run the Client (Frontend)

1. Navigate to the client directory
   ```sh
   cd client/
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Start the Vite dev server
   ```sh
   npm run dev
   ```

✅ The frontend should now be running at **http://localhost:5173**

## Repository Scripts / How to Run

- **Backend (Django)**: from `server/`
  ```sh
  python manage.py runserver
  ```

- **Frontend (Vite/React)**: from `client/`
  ```sh
  npm run dev
  ```

Keep both processes running for the full app experience.

## Features

- Protected authentication: Sign In, Sign Up, Forgot Password
- Role-based dashboards: separate landing pages after login for `User` and `Admin`
- Text-to-Speech (TTS)
- Image-to-Speech (OCR + TTS)
- Modern, responsive UI using Material UI
- Full-stack integration with clean API boundaries

## Tech Stack

- Frontend: React (Vite), React Router, TanStack Query, Material UI
- Auth: react-auth-kit
- Backend: Django (Python)
- Database: MongoDB (local), make sure `mongod` is running

## Project Structure

```
TextToSpeech_FullStack/
├─ client/           # React + Vite frontend
└─ server/           # Django backend
```

## Authentication & Routing

- **Protected routes**: Sign In, Sign Up, and Forgot Password flows are implemented. Auth is enforced for app routes.
- **Dashboards**:
  - User dashboard: ` /dashboard/user `
  - Admin dashboard: ` /dashboard/admin `
- **Post-login landing** is determined by the authenticated role (admin vs user).

## Environment Variables

Backend uses environment variables. Start by copying the template:

```sh
cd server/
copy .env.template .env  # Windows
# or
cp .env.template .env    # Mac/Linux
```
Then fill in values (e.g., database URI, any API keys if applicable).




