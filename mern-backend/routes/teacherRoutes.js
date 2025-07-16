const express = require('express')
const teacherMiddleware = require('../middlewares/teacherMiddleware')
const { createTest, deleteTest, getAllTests, getAllQuestions, updateQuestionInTest, addQuestionToTest, removeQuestionFromTest, extractImagesFromPDF, processImagesWithOCR, uploadAnswerSheet, evaluateResult, updateMarks, getAllTestsTeacher, getAllStudentsofStd, getAnswerSheet } = require('../controllers/TeacherController')

const teacherRouter = express.Router()

const upload = require('../middlewares/uploadAnswersheet')
const { getAllStudents } = require('../controllers/AdminController')

// teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.post('/upload/:studentId/:testId', teacherMiddleware, upload.single('file'), uploadAnswerSheet);

teacherRouter.post('/deletetest/:id', teacherMiddleware, deleteTest)
teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.get('/getAllTests', teacherMiddleware, getAllTests)
//single Teacher
teacherRouter.get('/getAllTestsTeacher', teacherMiddleware, getAllTestsTeacher)
//get all the students of particular standard
teacherRouter.get('/getAllStdntsOfStd/:standardId', teacherMiddleware, getAllStudentsofStd)

teacherRouter.get("/test/:testId/questions", teacherMiddleware, getAllQuestions);
teacherRouter.put("/updateQuestion/:testId/question/:questionId", teacherMiddleware, updateQuestionInTest);
teacherRouter.post("/addQuestion/:testId/", teacherMiddleware, addQuestionToTest);
teacherRouter.post("/removeQuestion/:testId/question/:questionId", teacherMiddleware, removeQuestionFromTest);
teacherRouter.post("/evaulateResult", teacherMiddleware, evaluateResult);
teacherRouter.put("/updateMarks/:testId/:studentId", teacherMiddleware, updateMarks);
teacherRouter.post("/getAnswerSheet", teacherMiddleware, getAnswerSheet);
teacherRouter.get('/getAllStudents', teacherMiddleware, getAllStudents)


module.exports = teacherRouter  