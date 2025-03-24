const mongoose = require("mongoose")
const Student = require("../models/Student");
const User = require("../models/User");
const Test = require("../models/Test");

const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id }).populate("userId", "-password")
        if (!student) {
            return res.status(404).json({ message: "Student not found", success: false });
        }

        return res.status(200).json({ student, success: true });
    } catch (error) {
        console.error("Student Profile Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}
const updateStudentProfile = async (req, res) => {
    try {
        const { name, email, standard, section } = req.body;

        //update userModel
        const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true })
        if (user) {
            await user.save()
            //update student model
            const updatedStudent = await Student.findOneAndUpdate({ userId: req.user.id }, { standard, section }, { new: true, runValidators: true }).populate("userId", "-password")
            if (!updatedStudent) {
                return res.status(404).json({ message: "Student not found", success: false });
            }
            return res.status(200).json({ student: updatedStudent, success: true });
        }



    }

    catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}
//this api is remainignt o be tested
const getStudentTests = async (req, res) => {
    try {
        const attemtedTests = await Test.find({ studentsAttempted: req.user.id })
        return res.status(500).json({ attemtedTests, message: "Internal Server Error", success: false });

    } catch (error) {
        console.log(error)
    }
}
module.exports = { getStudentProfile, getStudentTests, updateStudentProfile }