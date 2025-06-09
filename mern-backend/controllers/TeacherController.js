const Question = require("../models/Question");
const Test = require("../models/Test");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
const Standard = require("../models/Standard");

const createTest = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const {
            // Provided directly
            subjectId,
            standardId,
            testTitle,
            totalMarks,
            testDate,
            durationMinutes,
            questions
        } = req.body;

        // 🧪 Basic Validation
        if (!teacherId || !subjectId || !standardId || !testTitle || !testDate || !totalMarks || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Missing required fields", success: false });
        }

        // 🔍 Validate teacher existence
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(403).json({ message: "Invalid teacher ID", success: false });
        }

        // 🔐 Validate teacher access to subject-standard pair
        const hasAccess = teacher.subjects.some(s =>
            s.subjectId.toString() === subjectId &&
            s.standardId.toString() === standardId
        );

        if (!hasAccess) {
            return res.status(403).json({ message: "Teacher not assigned to this subject-standard pair", success: false });
        }

        // 🔄 Check for duplicate test
        const duplicateTest = await Test.findOne({
            teacherId,
            subjectId,
            standardId,
            testTitle: testTitle.trim(),
            testDate: new Date(testDate),
            totalMarks
        });

        if (duplicateTest) {
            return res.status(400).json({ message: "Test already exists with same details", success: false });
        }

        // 📌 Process Questions
        const questionIds = [];

        for (const q of questions) {
            if (!q.questionText || !q.referenceAnswer || !q.marks) {
                return res.status(400).json({ message: "Each question must have questionText, referenceAnswer, and marks", success: false });
            }

            const existing = await Question.findOne({
                questionText: q.questionText.trim(),
                referenceAnswer: q.referenceAnswer.trim(),
                marks: q.marks
            });

            if (existing) {
                questionIds.push(existing._id);
            } else {
                const newQ = await Question.create({
                    questionText: q.questionText.trim(),
                    referenceAnswer: q.referenceAnswer.trim(),
                    marks: q.marks
                });
                questionIds.push(newQ._id);
            }
        }

        // ✅ Create Test
        const newTest = await Test.create({
            teacherId,
            subjectId,
            standardId,
            testTitle: testTitle.trim(),
            totalMarks,
            testDate: new Date(testDate),
            durationMinutes,
            questionIds
        });

        return res.status(201).json({
            message: "Test created successfully",
            test: newTest,
            success: true
        });

    } catch (err) {
        console.error("Error creating test:", err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
const getAllTests = async (req, res) => {
    try {
        const tests = await Test.find()
            .populate("teacherId", "userId") // Only populate `userId` from Teacher
            .populate("subjectId", "subject_name") // Only get subject_name from Subject
            .populate("standardId", "standard") // Only get standard name
            .populate("questionIds", "questionText referenceAnswer marks"); // Get detailed question info

        return res.status(200).json({
            message: "All tests fetched",
            tests,
            success: true
        });
    } catch (err) {
        console.error("Error fetching tests:", err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
const deleteTest = async (req, res) => {
    try {
        const testId = req.params.id;
        const userId = req.user.id;
        // console.log(userId, testId);
        if (!testId || !userId) {
            return res.status(400).json({ message: "Test ID and User ID are required", success: false });
        }

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found", success: false });
        }

        const teacher = await Teacher.findOne({ userId: userId });
        if (!teacher) {
            return res.status(403).json({ message: "Only teachers can delete tests", success: false });
        }

        // Ensure that the test belongs to the teacher
        if (test.teacherId.toString() !== teacher._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this test", success: false });
        }

        await Test.findByIdAndDelete(testId);

        return res.status(200).json({ message: "Test deleted successfully", success: true });

    } catch (error) {
        console.error("Error deleting test:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
module.exports = { createTest, getAllTests, deleteTest };
