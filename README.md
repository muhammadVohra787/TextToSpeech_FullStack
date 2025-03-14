# TTS App Server  
## Python version -> Python 3.12.3
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

4. **Run the Django development server**  
   ```sh
   python manage.py runserver
   ```

✅ Your server should now be running at **http://127.0.0.1:8000/** 🚀
```

```
For running **AI-Side**
Unzip the zip folder and use it as it is.

For the **server side**
```
source venv/bin/ai
pip install -r requirements.txt
python manage.py runserver
✅ Your server should now be running at **http://127.0.0.1:8000/** 🚀
```
For the **client side**
```
npm start
Note: Make sure node modules is there in the client folder.
```

```

