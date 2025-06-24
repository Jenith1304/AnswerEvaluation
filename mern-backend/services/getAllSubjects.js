const Subject = require("../models/Subject")

const getAllSubjects = async()=>{
    
    const response = await Subject.find().select('subject_name')

    if(response)
        return response
    return null

}

module.exports =getAllSubjects