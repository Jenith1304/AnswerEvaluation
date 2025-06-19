const Teacher = require("../models/Teacher")


const getStandardBasedTeacher = async(standardId)=>{
    try {
        
        const response = await Teacher.find({"subjects.standardId" : standardId}).select('-__v').populate('userId','name email')

        return response

    } catch (error) {
        console.error("Error in StandardBasedTeacherService : ",error)

        return null
    }
}

module.exports = getStandardBasedTeacher