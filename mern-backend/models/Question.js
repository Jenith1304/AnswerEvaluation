const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    subject: { type: String, required: true },
    standard: { type: String, required: true },
    questionText: { type: String, required: true },
    referenceAnswer: { type: String, required: true }
});

module.exports = mongoose.model("Question", QuestionSchema);
