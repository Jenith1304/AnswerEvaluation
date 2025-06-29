const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    result: {
        type: [
            {
                questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
                marks_obtained: {
                    type: Number,
                    required: true,
                    min: [0, 'Obtained marks cannot be negative']
                }
            }
        ],
        default: []

    }
}, { timestamps: true });

module.exports = mongoose.model("Result", ResultSchema);
