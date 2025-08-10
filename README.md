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
   
4. **Run the Django development server with makemigrations**  
   ```sh
   python manage.py makemigrations
   ```
   
5. **Run the Django development server**  
   ```sh
   python manage.py runserver
   ```

✅ Your server should now be running at **http://localhost:5173** 🚀

If you're still encountering any error, run the VS Code as administrator
```

```

Scripts to execute

server => python manage.py runserver

client => npm run dev

<img width="1094" height="900" alt="image" src="https://github.com/user-attachments/assets/e68a98a5-59bf-4ebb-9b69-b576b1b9cb07" />

<img width="1094" height="900" alt="image" src="https://github.com/user-attachments/assets/5e54b23a-d540-4198-9912-d3190628f884" />

<img width="1314" height="575" alt="image" src="https://github.com/user-attachments/assets/9403805c-612c-4880-8960-79a8ca609125" />


