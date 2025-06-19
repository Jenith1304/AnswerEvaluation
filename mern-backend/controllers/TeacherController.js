const Question = require("../models/Question");
const Test = require("../models/Test");
const Teacher = require("../models/Teacher");
const AnswerSheetPDF = require("../models/AnswerSheetPDF")
const getPdfPageCount = require("../services/getPdfPageCount");
const generateImageUrlsFromCloudinaryPDF = require("../services/pdfToImageUrls");
const vision = require('@google-cloud/vision');
// Init Google Vision client (make sure GOOGLE_APPLICATION_CREDENTIALS is set)
const client = new vision.ImageAnnotatorClient();


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

//for getting all questions of particular test
const getAllQuestions = async (req, res) => {
    try {
        const { testId } = req.params;

        if (!testId) {
            return res.status(400).json({ message: "Test ID is required", success: false });
        }

        const test = await Test.findById(testId).populate("questionIds");

        if (!test) {
            return res.status(404).json({ message: "Test not found", success: false });
        }

        return res.status(200).json({
            message: "Questions fetched successfully",
            questions: test.questionIds,
            success: true
        });
    } catch (error) {
        console.error("Error fetching test questions:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const AnswerSheetPDF = require('../models/AnswerSheetPDF')

const uploadAnswerSheet = async (req, res) => {
    try {
        const { studentId, testId } = req.params;
        const teacherId = req.user.id; // assuming authentication sets req.user

        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "No file uploaded", success: false });
        }

        const newAnswer = await AnswerSheetPDF.create({
            studentId,
            testId,
            fileUrl: req.file.path,
            uploadedBy: teacherId
        });

        return res.status(201).json({
            message: "Answer sheet uploaded successfully",
            data: newAnswer,
            success: true
        });
    } catch (err) {
        console.error("Answer sheet upload error:", err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


const updateQuestionInTest = async (req, res) => {
    try {
        const { testId, questionId } = req.params;
        const { questionText, referenceAnswer, marks } = req.body;

        // ❌ If testId or questionId is missing in the request URL
        if (!testId || !questionId) {
            return res.status(400).json({
                message: "Cannot PUT - testId or questionId missing",
                success: false
            });
        }

        // ❌ If any required field is missing
        if (!questionText || !referenceAnswer || marks === undefined) {
            return res.status(400).json({
                message: "All fields (questionText, referenceAnswer, marks) are required",
                success: false
            });
        }

        // ✅ Check if test exists
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({
                message: "Test not found",
                success: false
            });
        }

        // ✅ Check if the question belongs to the test
        const isQuestionInTest = test.questionIds.includes(questionId);
        if (!isQuestionInTest) {
            return res.status(403).json({
                message: "This question does not belong to the given test",
                success: false
            });
        }

        // ✅ Update the question
        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            {
                questionText: questionText.trim(),
                referenceAnswer: referenceAnswer.trim(),
                marks
            },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                message: "Question not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Question updated successfully",
            question: updatedQuestion,
            success: true
        });
    } catch (error) {
        console.error("Error updating question in test:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
const addQuestionToTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const { questionText, referenceAnswer, marks } = req.body;

        // ✅ Check if testId is provided
        if (!testId) {
            return res.status(400).json({ message: "testId is required", success: false });
        }

        // ✅ Check required fields
        if (!questionText || !referenceAnswer || marks === undefined) {
            return res.status(400).json({
                message: "questionText, referenceAnswer, and marks are required",
                success: false
            });
        }

        // ✅ Check if test exists
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found", success: false });
        }

        // ✅ Check if the same question already exists (by content)
        let question = await Question.findOne({
            questionText: questionText.trim(),
            referenceAnswer: referenceAnswer.trim(),
            marks
        });

        // ✅ If not, create new question
        if (!question) {
            question = await Question.create({
                questionText: questionText.trim(),
                referenceAnswer: referenceAnswer.trim(),
                marks
            });
        }

        // ✅ Prevent adding the same question twice to the same test
        const isAlreadyInTest = test.questionIds.includes(question._id);
        if (isAlreadyInTest) {
            return res.status(400).json({
                message: "Question already exists in the test",
                success: false
            });
        }

        // ✅ Add question to test
        test.questionIds.push(question._id);
        await test.save();

        return res.status(201).json({
            message: "Question added to test successfully",
            question,
            success: true
        });

    } catch (error) {
        console.error("Error in addQuestionToTest:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
const removeQuestionFromTest = async (req, res) => {
    try {
        const { testId, questionId } = req.params;

        // ✅ Validate input
        if (!testId || !questionId) {
            return res.status(400).json({ message: "Both testId and questionId are required", success: false });
        }

        // ✅ Find the test
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found", success: false });
        }

        // ✅ Check if the question exists in test
        const questionIndex = test.questionIds.indexOf(questionId);
        if (questionIndex === -1) {
            return res.status(404).json({ message: "Question not found in test", success: false });
        }

        // ✅ Remove question
        test.questionIds.splice(questionIndex, 1);
        await test.save();

        return res.status(200).json({
            message: "Question removed from test successfully",
            success: true
        });

    } catch (error) {
        console.error("Error in removeQuestionFromTest:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
const extractImagesFromPDF = async (req, res) => {
    try {
        const { answerSheetId } = req.body;

        if (!answerSheetId) {
            return res.status(400).json({ error: "answerSheetId is required." });
        }

        // Fetch PDF record
        const pdfRecord = await AnswerSheetPDF.findById(answerSheetId);
        if (!pdfRecord) {
            return res.status(404).json({ error: "Answer sheet not found." });
        }

        const fileUrl = pdfRecord.fileUrl;

        // ✅ Extract correct public_id from Cloudinary URL (without version and extension)
        const fileUrlParts = fileUrl.split("/upload/");
        if (fileUrlParts.length < 2) {
            return res.status(400).json({ error: "Invalid Cloudinary URL format." });
        }

        let publicIdWithExt = fileUrlParts[1]; // e.g. "v123456789/folder/filename.pdf"
        let pathParts = publicIdWithExt.split("/");

        // Remove version prefix (starts with 'v')
        if (pathParts[0].startsWith("v") && !isNaN(pathParts[0].slice(1))) {
            pathParts.shift();
        }

        const cleanedPublicId = pathParts.join("/").replace(".pdf", "");

        // ✅ Get total page count
        const totalPages = await getPdfPageCount(cleanedPublicId);
        if (!totalPages || totalPages < 1) {
            return res.status(400).json({ error: "Could not determine page count of the PDF." });
        }

        // ✅ Generate image URLs for each page using Cloudinary transformations
        const imageUrls = generateImageUrlsFromCloudinaryPDF(fileUrl, totalPages);






        //image URL to Cloud VISION
        // const questionRegex = /(Q\.\?\s?\d+|Question\s?\d+|\b\d+\.)/gi;
        // const { imageUrls } = req.body;

        if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
            return res.status(400).json({ error: 'imageUrls must be a non-empty array.' });
        }

        const extractedAnswers = [];

        for (let i = 0; i < imageUrls.length; i++) {
            const url = imageUrls[i];

            const [result] = await client.documentTextDetection({ image: { source: { imageUri: url } } });

            const fullText = result.fullTextAnnotation?.text || '';

            if (!fullText.trim()) {
                extractedAnswers.push(`Answer ${i + 1}:
                    No text detected.`);
                continue;
            }

            // Treat entire page as a separate answer
            extractedAnswers.push(`Answer ${i + 1}:
            ${fullText.trim()}`);
        }

        // Combine all answers
        const finalText = extractedAnswers.join('\n\n-------------------------------\n\n');

        // Return the final structured text
        // return res.status(200).json({ totalPages, imageUrls });
        return res.status(200).json({ message: 'OCR completed successfully.', textOutput: finalText, totalPages, imageUrls });


    } catch (err) {
        console.error("Failed to extract PDF pages", err);
        res.status(500).json({ error: "Internal server error" });
        console.error('OCR Processing Failed:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    createTest, getAllTests, deleteTest, getAllQuestions, updateQuestionInTest, addQuestionToTest, removeQuestionFromTest, extractImagesFromPDF, uploadAnswerSheet
};
