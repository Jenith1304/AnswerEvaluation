const express = require('express')
const teacherMiddleware = require('../middlewares/teacherMiddleware')
const { createTest, deleteTest, getAllTests, getAllQuestions, updateQuestionInTest } = require('../controllers/TeacherController')

const teacherRouter = express.Router()

teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.post('/deletetest/:id', teacherMiddleware, deleteTest)
teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.get('/getAllTests', teacherMiddleware, getAllTests)
teacherRouter.get("/test/:testId/questions", teacherMiddleware, getAllQuestions);
teacherRouter.put("/test/:testId/question/:questionId", updateQuestionInTest);

module.exports = teacherRouter  