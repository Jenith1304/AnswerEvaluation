First Install Dependencies using<br>
pip install -r requirements.txt
</br>
Then create the v
irtual environment using 'python -m venv venv'<br>
Start the virtual environment using 'venv\Scripts\activate'<br>
Then start the FASTAPI Server<br>
cd backend<br>
uvicorn main:app --reload<br>
Test The API <br>
5.2 Using Postman<br>
Open Postman.<br>

Choose POST method and enter http://127.0.0.1:8000/evaluate.<br>

Go to Body → raw → JSON and enter:<br>

{<br>
"reference_answer": "Mitochondria are the powerhouse of the cell.",<br>
"student_answer": "Mitochondria produce energy for the cell."<br>
}<br>
📂 answer-evaluation-ai<br>
┣ 📂 backend<br>
┃ ┣ 📂 models<br>
┃ ┣ 📂 controllers<br>
┃ ┃ ┣ 📜 AuthController.js<br>
┃ ┃ ┣ 📜 StudentController.js<br>
┃ ┃ ┣ 📜 TeacherController.js<br>
┃ ┃ ┣ 📜 AdminController.js<br>
┃ ┃ ┣ 📜 TestController.js<br>
┃ ┃ ┣ 📜 QuestionController.js<br>
┃ ┃ ┣ 📜 AnswerEvaluationController.js<br>
┃ ┃ ┗ 📜 TestAnalysisController.js<br>
┃ ┣ 📂 routes<br>
┃ ┣ 📂 middlewares<br>
┃ ┃ ┣ 📜 authMiddleware.js<br>
┃ ┃ ┣ 📜 errorMiddleware.js<br>
┃ ┃ ┣ 📜 validationMiddleware.js<br>
┃ ┃ ┣ 📜 fileUploadMiddleware.js<br>
┃ ┃ ┣ 📜 loggerMiddleware.js<br>
┃ ┃ ┗ 📜 securityMiddleware.js
┃ ┣ 📜 server.js<br>
┃ ┣ 📜 config.js<br>
┃ ┗ 📜 package.json<br>
┣ 📂 frontend (Later)<br>
┗ 📜 README.md<br>
