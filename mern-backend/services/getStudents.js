const Student = require("../models/Student")

const getStudents = async()=>
{
    try {
        
        const response = await Student.find().select("userId standardId rollNumber")
                        .populate('userId','name email').populate('standardId','standard')

        return response

    } catch (error) {
        console.error("Error in getStudentService:",error)
        return null
    }

}

module.exports = getStudents