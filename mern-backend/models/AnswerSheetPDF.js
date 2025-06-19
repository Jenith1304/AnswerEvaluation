const mongoose = require("mongoose");

const AnswerSheetSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  fileUrl: { type: String, required: true }, // Cloudinary PDF URL
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  uploadedAt: { type: Date, default: Date.now }
});

AnswerSheetPDF = mongoose.model("AnswerSheetPDF", AnswerSheetSchema);
module.exports = AnswerSheetPDF;
