const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,// Prevent multiple teacher records for the same user
    },
    subjects: [
        {
            subjectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
                required: true
            },
            standardId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Standard",
                required: true
            },
            sectionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Section",

            }
        }
    ]
});

module.exports = mongoose.model("Teacher", TeacherSchema);
