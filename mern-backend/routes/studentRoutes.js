const express = require("express");
const studentMiddleware = require("../middlewares/studentMiddleware");
const { getStudentProfile, updateStudentProfile, getStudentTests } = require("../controllers/StudentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/profile", authMiddleware, studentMiddleware, getStudentProfile);
router.put("/profile", authMiddleware, studentMiddleware, updateStudentProfile)
router.get("/tests", authMiddleware, studentMiddleware, getStudentTests);

module.exports = router;
