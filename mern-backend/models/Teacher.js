const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjects: [
        {
            subject_name: { type: String, required: true },
            standard: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model("Teacher", TeacherSchema);
