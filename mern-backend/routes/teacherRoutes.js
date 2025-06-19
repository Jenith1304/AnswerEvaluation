const express = require('express')
const teacherMiddleware = require('../middlewares/teacherMiddleware')
const { createTest, deleteTest, getAllTests, getAllQuestions, updateQuestionInTest, addQuestionToTest, removeQuestionFromTest, extractImagesFromPDF } = require('../controllers/TeacherController')
const { createTest, deleteTest, uploadAnswerSheet } = require('../controllers/TeacherController')

const teacherRouter = express.Router()

const upload = require('../middlewares/uploadAnswersheet')

teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.post('/deletetest/:id', teacherMiddleware, deleteTest)
teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.get('/getAllTests', teacherMiddleware, getAllTests)
teacherRouter.get("/test/:testId/questions", teacherMiddleware, getAllQuestions);
teacherRouter.put("/test/:testId/question/:questionId", teacherMiddleware, updateQuestionInTest);
teacherRouter.post("/test/:testId/", teacherMiddleware, addQuestionToTest);
teacherRouter.post("/test/:testId/question/:questionId", teacherMiddleware, removeQuestionFromTest);
teacherRouter.get("/extractImagesFromPDF", teacherMiddleware, extractImagesFromPDF);
teacherRouter.post('/deletetest', teacherMiddleware, deleteTest)
teacherRouter.post('/upload/:studentId/:testId', teacherMiddleware, upload.single('file'), uploadAnswerSheet);


module.exports = teacherRouter  