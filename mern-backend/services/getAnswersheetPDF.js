const AnswerSheetPDF = require('../models/AnswerSheetPDF.js')

const getAnswersheet = async (studentId, testId) => {
    const response = await AnswerSheetPDF.findOne({ testId: testId, studentId: studentId })

    return response
}

module.exports = getAnswersheet