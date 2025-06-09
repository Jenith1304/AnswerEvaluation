const Student = require("../models/Student")

const getStudentsBasedOnStandard = async(standardId)=>{
try {
        
        const response = await Student.find({standardId : standardId}).select("userId standardId rollNumber")
                        .populate('userId','name email').populate('standardId','standard')

        return response

    } catch (error) {
        console.error("Error in getStudentService:",error)
        return null
    }

}

module.exports = getStudentsBasedOnStandard