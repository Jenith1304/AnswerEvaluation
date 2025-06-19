const Test = require("../models/Test");
const AnswerSheetPDF = require('../models/AnswerSheetPDF')

const createTest = async (req, res) => {

    try {
        const teacherId = req.user.id

        const { testName, subjectId, standardId } = req.body

        if (!testName || !subjectId || !standardId)
            return res.status(400).json({ message: "Please provide all the fields" })

        //⁡⁣⁣⁢check if test is already exist or not⁡
        let test = await Test.findOne({ testName: testName, standard: standardId, subject: subjectId })

        if (test)
            return res.status(400).json({ message: "Test is already exist with this name", success: false })

        //⁡⁣⁣⁢ create an new test⁡
        test = await Test.create({ teacherId: teacherId, standard: standardId, subject: subjectId, testName: testName })

        return res.status(201).json({ message: "Test is created ", success: true })


    } catch (error) {
        console.error("Error in Creating test : ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const deleteTest = async (req, res) => {
    try {
        const { testId } = req.body

        // ⁡⁣⁣⁢check if test exist and delete it⁡
        const test = await Test.findOneAndDelete({ _id: testId })
        if (!test)
            return res.status(400).json({ message: "Test is not exist with this id", success: false })

        return res.status(200).json({ message: "Test is deleted successfully", success: true })

    } catch (error) {
        console.error("Error in deleteTest : ", err)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

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


module.exports = { createTest, deleteTest ,uploadAnswerSheet}