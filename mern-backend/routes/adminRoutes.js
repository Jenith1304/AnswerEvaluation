const express = require("express");
const { createTeacher, createStudent,addStandard, addSubjectToStandard, removeSubjectFromStandard, addSubject, deleteSubject, getAllTeacher, getAllStudents } = require("../controllers/AdminController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();

router.post('/createTeacher', adminMiddleware, createTeacher)
router.post('/createStudent', adminMiddleware, createStudent);
router.post('/addStandard', adminMiddleware, addStandard);
router.post('/addSubjectToStandard', adminMiddleware, addSubjectToStandard);
router.post('/removeSubjectFromStandard', adminMiddleware, removeSubjectFromStandard);
router.post('/addSubject', adminMiddleware, addSubject);
router.post('/deleteSubject', adminMiddleware, deleteSubject);
router.get('/getTeachers',adminMiddleware,getAllTeacher)
router.get('/getStudents',adminMiddleware,getAllStudents)

module.exports = router;
