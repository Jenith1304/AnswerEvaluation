const Standard = require("../models/Standard")


const isStandardExist = async (standard) => {
    const standardData = await Standard.findOne({ standard: standard })

    return standardData
}

const isSubjectInStandard = async (standard, subjectId) => {
    const standardData = await Standard.findOne({
        standard: standard, subjects: {
            $elemMatch: { subjectId: subjectId }
        }
    })

    return standardData
}

module.exports = { isStandardExist, isSubjectInStandard }