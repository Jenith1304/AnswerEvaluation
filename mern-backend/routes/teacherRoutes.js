const express = require('express')
const teacherMiddleware = require('../middlewares/teacherMiddleware')
const { createTest, deleteTest, uploadAnswerSheet } = require('../controllers/TeacherController')

const teacherRouter = express.Router()

const upload = require('../middlewares/uploadAnswersheet')

teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.post('/deletetest', teacherMiddleware, deleteTest)
teacherRouter.post('/upload/:studentId/:testId', teacherMiddleware, upload.single('file'), uploadAnswerSheet);


module.exports = teacherRouter