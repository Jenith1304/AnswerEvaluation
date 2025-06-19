const express = require("express");
// const { createTeacher, createStudent, createTest, deleteTest, addStandard, addSubjectToStandard, removeSubjectFromStandard, addSubject, deleteSubject, assignSubjectToTeacher, removeAssignedSubject } = require("../controllers/AdminController");
const { createTeacher, createStudent, createTest, deleteTest, addStandard, addSubjectToStandard, removeSubjectFromStandard, addSubject, deleteSubject, getStandardBasedTeachers, getStandardBasedStudent,assignSubjectToTeacher ,removeAssignedSubject} = require("../controllers/AdminController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const router = express.Router();

router.post('/createTeacher', adminMiddleware, createTeacher)
router.post('/createStudent', adminMiddleware, createStudent);
router.post('/addStandard', adminMiddleware, addStandard);
router.post('/addSubjectToStandard', adminMiddleware, addSubjectToStandard);
router.post('/removeSubjectFromStandard', adminMiddleware, removeSubjectFromStandard);
router.post('/addSubject', adminMiddleware, addSubject);
router.post('/deleteSubject', adminMiddleware, deleteSubject);
router.get('/assignSubject/:id', assignSubjectToTeacher);
router.get('/deassignSubject/:id', removeAssignedSubject);

router.get('/getStandardBasedTeacher/:standardId',adminMiddleware,getStandardBasedTeachers)
router.get('/getStandardBasedStudent/:standardId',adminMiddleware,getStandardBasedStudent)

module.exports = router;
