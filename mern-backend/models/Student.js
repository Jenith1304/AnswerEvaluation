const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    standardId: { type: mongoose.Schema.Types.ObjectId, ref: "Standard", required: true },
    section: { type: String },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    rollNumber: { type: String, required: true, unique: true },

});

module.exports = mongoose.model("Student", StudentSchema);
