const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    referenceAnswer: { type: String, required: true },
    marks: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
