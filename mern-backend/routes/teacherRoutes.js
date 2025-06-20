const express = require('express')
const teacherMiddleware = require('../middlewares/teacherMiddleware')
const { createTest, deleteTest, getAllTests, getAllQuestions, updateQuestionInTest, addQuestionToTest, removeQuestionFromTest, extractImagesFromPDF, processImagesWithOCR, uploadAnswerSheet, evaluateResult } = require('../controllers/TeacherController')

const teacherRouter = express.Router()

const upload = require('../middlewares/uploadAnswersheet')

teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.post('/upload/:studentId/:testId', teacherMiddleware, upload.single('file'), uploadAnswerSheet);

teacherRouter.post('/deletetest/:id', teacherMiddleware, deleteTest)
teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.get('/getAllTests', teacherMiddleware, getAllTests)
teacherRouter.get("/test/:testId/questions", teacherMiddleware, getAllQuestions);
teacherRouter.put("/updateQuestion/:testId/question/:questionId", teacherMiddleware, updateQuestionInTest);
teacherRouter.post("/addQuestion/:testId/", teacherMiddleware, addQuestionToTest);
teacherRouter.post("/removeQuestion/:testId/question/:questionId", teacherMiddleware, removeQuestionFromTest);
teacherRouter.get("/extractImagesFromPDF", teacherMiddleware, evaluateResult);

module.exports = teacherRouter  