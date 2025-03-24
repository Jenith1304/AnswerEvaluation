const mongoose = require("mongoose");

const TestAnalysisSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    standard: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    totalStudents: { type: Number, required: true },
    studentsAttempted: { type: Number, required: true },
    averageScore: { type: Number, required: true },
    highestScore: { type: Number, required: true },
    lowestScore: { type: Number, required: true },
    detailedAnalysis: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
            averageSimilarityScore: { type: Number, required: true },
            mostCommonMistake: { type: String }
        }
    ]
});

module.exports = mongoose.model("TestAnalysis", TestAnalysisSchema);
