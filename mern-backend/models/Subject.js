const mongoose = require('mongoose')
const Standard = require('./Standard')

const SubjectSchema = new mongoose.Schema({
    subject_name: { type: String, required: true, trim: true, unique: true, uppercase: true }
})

SubjectSchema.post(['findOneAndDelete', 'deleteOne'], async (doc, next) => {
    try {
        await Standard.updateMany(
            { "subjects.subjectId": doc._id },
            { $pull: { subjects: { subjectId: doc._id } } }
        )
        next()
    }
    catch (e) {
        console.error("Error at Pre Midddleware of Subject : ", e)
        next(e)
    }
})

const Subject = mongoose.model("Subject", SubjectSchema)


module.exports = Subject