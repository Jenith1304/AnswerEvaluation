const mongoose = require("mongoose");


const TestSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  standardId: { type: mongoose.Schema.Types.ObjectId, ref: "Standard", required: true },
  testTitle: { type: String, required: true },
  totalMarks: { type: Number, required: true, default: 0 },
  testDate: { type: Date, required: true },
  durationMinutes: { type: Number },
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  studentsAttempted: {
    type: [{
      studentId: { type: mongoose.Types.ObjectId, ref: "Student" },
      resultId: { type: mongoose.Types.ObjectId, ref: "Result" }
    }],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Test", TestSchema);
