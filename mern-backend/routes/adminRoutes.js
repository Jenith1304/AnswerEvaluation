const express = require("express");

const { createTeacher, createStudent, createTest, deleteTest, addStandard, addSubjectToStandard, removeSubjectFromStandard, addSubject, deleteSubject, getStandardBasedTeachers, getStandardBasedStudent, assignSubjectToTeacher, removeAssignedSubject, getAllStudents, getAllTeacher, getAllSubjectController, getTeacher, deleteTeacher } = require("../controllers/AdminController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { getAllTests } = require("../controllers/TeacherController");
const router = express.Router();

router.post('/createTeacher', adminMiddleware, createTeacher)
router.post('/createStudent', adminMiddleware, createStudent);
router.post('/addStandard', adminMiddleware, addStandard);
router.post('/addSubjectToStandard', adminMiddleware, addSubjectToStandard);
router.post('/removeSubjectFromStandard', adminMiddleware, removeSubjectFromStandard);
router.post('/addSubject', adminMiddleware, addSubject);
router.post('/deleteSubject', adminMiddleware, deleteSubject);
router.post('/assignSubject/:id', adminMiddleware, assignSubjectToTeacher);
router.post('/deassignSubject/:id', adminMiddleware, removeAssignedSubject);
router.get('/getAllSubjects', adminMiddleware, getAllSubjectController)
router.get('/getStandardBasedTeacher/:standardId', adminMiddleware, getStandardBasedTeachers)
router.get('/getStandardBasedStudent/:standardId', adminMiddleware, getStandardBasedStudent)

router.get('/getAllStudents', adminMiddleware, getAllStudents)
router.get('/getAllTeachers', adminMiddleware, getAllTeacher)
router.get('/getTeacher/:teacherId', adminMiddleware, getTeacher)
router.delete("/deleteTeacher/:id", adminMiddleware, deleteTeacher);
router.get('/getAllTests', adminMiddleware, getAllTests)
module.exports = router;
