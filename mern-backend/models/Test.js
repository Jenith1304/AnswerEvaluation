const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "TEACHER", required: true },
  // subject: { type: String, required: true },
  subject : { type : mongoose.Types.ObjectId, required : true, ref : "SUBJECT" },
  // standard: { type: String, required: true },
  standard : {type : mongoose.Types.ObjectId, ref : 'STANDARD', required : true},
  testName: { type: String, required: true ,trim : true, uppercase : true},
  // questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "QUESTION" }],
  questions : {
    type : [{type : mongoose.Types.ObjectId ,ref: "QUESTION"}],
    default : []
  },
  // studentsAttempted: [{ type: mongoose.Types.ObjectId, ref: "STUDENT" }]
  studentsAttempted : {
    type : [
      {
        studentId : {type : mongoose.Types.ObjectId , ref : "STUDENT"},
        resultId : { type : mongoose.Types.ObjectId, ref : "RESULT"}
      }
    ],
    default : [],
  },
  
},{timestamps : true});

module.exports = mongoose.model("Test", TestSchema);