
const mongoose = require('mongoose')

const StandardSchema = new mongoose.Schema({
    standard: { type: String, required: true, trim: true },

    subjects: {
        type: [
            { subjectId: { type: mongoose.Types.ObjectId, ref: 'Subject', required: true } }
        ],
    }

})

const Standard = mongoose.model("Standard", StandardSchema)

module.exports = Standard