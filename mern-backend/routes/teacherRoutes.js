const express = require('express')
const teacherMiddleware = require('../middlewares/teacherMiddleware')
const { createTest, deleteTest, getAllTests } = require('../controllers/TeacherController')

const teacherRouter = express.Router()

teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.post('/deletetest/:id', teacherMiddleware, deleteTest)
teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.get('/getAllTests', teacherMiddleware, getAllTests)

module.exports = teacherRouter  