const mongoose = require("mongoose");
const Subject = require("../models/Subject");
const Standard = require("../models/Standard");

const resolveIdsByName = async (subjectName, standardName) => {
  const subject = await Subject.findOne({ subject_name: subjectName.trim().toUpperCase() });
  const standard = await Standard.findOne({ standard: standardName.trim() });

  if (!subject) throw new Error("Invalid Subject Name");
  if (!standard) throw new Error("Invalid Standard Name");

  return {
    subjectId: new mongoose.Types.ObjectId(subject._id),
    standardId: new mongoose.Types.ObjectId(standard._id),
  };
};

module.exports = resolveIdsByName;
