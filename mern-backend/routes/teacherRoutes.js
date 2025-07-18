const express = require('express')
const teacherMiddleware = require('../middlewares/teacherMiddleware')
// const { createTest, deleteTest, getAllTests, getAllQuestions, updateQuestionInTest, addQuestionToTest, removeQuestionFromTest, extractImagesFromPDF, processImagesWithOCR, uploadAnswerSheet, evaluateResult, getAllStandard, teacherBasedStandard } = require('../controllers/TeacherController')

const { createTest, deleteTest, getAllTests, getAllQuestions, updateQuestionInTest, addQuestionToTest, removeQuestionFromTest, extractImagesFromPDF, processImagesWithOCR, uploadAnswerSheet, evaluateResult, updateMarks, getAllTestsTeacher, getAllStudentsofStd, getAnswerSheet ,getAllStandard,teacherBasedStandard} = require('../controllers/TeacherController')

const teacherRouter = express.Router()

const upload = require('../middlewares/uploadAnswersheet')
const { getAllStudents, getStudentAnswersheetController, getStudent, createStudent } = require('../controllers/AdminController')

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

teacherRouter.get('/getStudent/:studentId', teacherMiddleware, getStudent)
teacherRouter.post('/createStudent', teacherMiddleware, createStudent);
teacherRouter.get('/getAllStandard',teacherMiddleware,getAllStandard)

teacherRouter.get('/getTeacherBasedStandard',teacherMiddleware,teacherBasedStandard)
teacherRouter.get('/getAnswersheet/:studentId/:testId', teacherMiddleware, getStudentAnswersheetController)

teacherRouter.put("/updateQuestion/:testId/question/:questionId", teacherMiddleware, updateQuestionInTest);
teacherRouter.put("/updateMarks/:testId/:studentId", teacherMiddleware, updateMarks);



module.exports = teacherRouter  