const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    standard: { type: String, required: true },
    section: { type: String, required: true }
});

module.exports = mongoose.model("Student", StudentSchema);
