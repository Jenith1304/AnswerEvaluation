const mongoose = require("mongoose");

const StudentAnswerSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
            studentAnswer: { type: String, required: true },
            similarityScore: { type: Number, required: true },
            marks: { type: String, required: true }
        }
    ],
    totalScore: { type: Number, required: true },
    evaluationCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("StudentAnswer", StudentAnswerSchema);
