const express = require('express')
const teacherMiddleware = require('../middlewares/teacherMiddleware')
const { createTest, deleteTest } = require('../controllers/TeacherController')

const teacherRouter = express.Router()

teacherRouter.post('/createTest', teacherMiddleware, createTest)
teacherRouter.post('/deletetest', teacherMiddleware, deleteTest)

module.exports = teacherRouter