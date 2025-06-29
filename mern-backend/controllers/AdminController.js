const User = require("../models/User");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const Standard = require("../models/Standard");
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject")
const { isSubjectInStandard } = require('../services/subjectAndStandard.service');
const getStudents = require("../services/getStudents");
const getStandardBasedTeacher = require("../services/getStandardBasedTeachers");
const getStudentsBasedOnStandard = require("../services/getStandardBasedStudents");
const getAllSubjects = require("../services/getAllSubjects");

const createTeacher = async (req, res) => {

    //demo
    // {
    //   "name": "Teacher1",
    //   "email": "teacher@gmail.com",
    //   "password": "teacher",
    //   "subjects": [
    //     {
    //       "subject_name": "MATHEMATICS",
    //       "standard_name": "9th"
    //     },
    //     {
    //       "subject_name": "SCIENCE",
    //       "standard_name": "10th"
    //     }
    //   ]
    // }
    try {
        const { name, email, password, subjects } = req.body;

        if (!name || !email || !password || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: "Please fill all details", success: false });
        }

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "teacher",
        });
        //if user is a teacher,create teacher record





        // For each subject entry, find the Subject and Standard by name
        const formattedSubjects = [];

        for (const s of subjects) {
            if (!s.subject_name || !s.standard_name) {
                return res.status(400).json({
                    message: "Each subject entry must have subject_name and standard_name",
                    success: false
                });
            }

            const subjectDoc = await Subject.findOne({ subject_name: s.subject_name.toUpperCase().trim() });
            if (!subjectDoc) {
                return res.status(400).json({
                    message: `Subject '${s.subject_name}' not found`,
                    success: false
                });
            }

            const standardDoc = await Standard.findOne({ standard: s.standard_name.trim() });
            if (!standardDoc) {
                return res.status(400).json({
                    message: `Standard '${s.standard_name}' not found`,
                    success: false
                });
            }

            formattedSubjects.push({
                subjectId: subjectDoc._id,
                standardId: standardDoc._id
                // section can be added later
            });

        }
        await Teacher.create({
            userId: user._id,
            subjects: formattedSubjects
        });


        // const payload = { user: { id: user.id, role: user.role } };
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });

        return res.status(201).json({ message: "Teacher Registered", success: true });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const createStudent = async (req, res) => {
    try {
        const { name, email, password, standard, dob, gender, rollNumber } = req.body;

        if (!name || !email || !password || !dob || !gender || !rollNumber || !standard) {
            return res.status(400).json({ message: "Please fill all details", success: false });
        }

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student",
        });
        // If user is a student, create Student record


        const standardDoc = await Standard.findOne({ standard: standard.trim() });
        if (!standardDoc) {
            return res.status(400).json({ message: `Standard '${standard}' not found`, success: false });
        }

        await Student.create({
            userId: user._id,
            standardId: standardDoc._id,
            dob,
            gender,
            rollNumber,
            // section can be added later
        });


        // const payload = { user: { id: user.id, role: user.role } };
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });

        return res.status(201).json({ message: "Student Registered", success: true });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const addStandard = async (req, res) => {
    try {
        const { standard, subjectId } = req.body


        // ⁡⁣⁣⁢check standard is exist⁡
        let response = await Standard.findOne({ standard: standard })

        if (response)
            return res.status(400).json({ message: "Standard is already exist,can not create an same standard", success: false })


        // ⁡⁣⁣⁢otherwise create an standard⁡
        response = await Standard.create({ standard: standard, subjects: [{ subjectId: subjectId }] })

        if (!response)
            return res.status(400).json({ message: 'Standrad is not created', success: false })
        return res.status(201).json({ message: "Standard is created", success: true })
    }
    catch (e) {
        console.error('Error at add Subject : ', e)
        return res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const addSubjectToStandard = async (req, res) => {
    try {
        //if subject in standatd
        const { standard, subjectId } = req.body

        //⁡⁣⁣⁢check Standard exist⁡
        let standardResponse = await Standard.findOne({ standard: standard })

        if (!standardResponse)
            return res.status(400).json({ message: 'There is no Standard Exist', success: false })

        //⁡⁣⁣⁢check subject is already exist⁡
        const isSubjectExist = await isSubjectInStandard(standard, subjectId)

        if (isSubjectExist)
            return res.status(400).json({ message: "Subject is already exist in this standard", success: false })

        //⁡⁣⁣⁢push an subject to standard⁡
        standardResponse.subjects.push({ subjectId: subjectId })
        standardResponse.save()

        return res.status(201).json({ message: `Subject is Added to standard ${standard}`, success: true })
    }
    catch (e) {
        console.error('Error in addSubjectToStandard : ', e)
        return res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const removeSubjectFromStandard = async (req, res) => {
    try {
        const { standard, subjectId } = req.body

        //⁡⁣⁣⁢check stnadrad exist or not⁡
        const standardData = await Standard.findOne({ standard: standard })

        if (!standardData)
            return res.status(400).json({ message: "Standard is not exist", sucess: false })

        //⁡⁣⁣⁢check subject exist or not⁡
        if (!(standardData.subjects.some((obj) => obj.subjectId.toString() === subjectId)))
            return res.status(400).json({ message: `Subject is not exist in standard : ${standardData.standard}`, success: false })

        //⁡⁣⁣⁢remove subject from standard⁡
        const response = await Standard.updateOne({ standard: standard, "subjects.subjectId": subjectId }, { $pull: { subjects: { subjectId: subjectId } } })

        if (!response)
            return res.status(400).json({ message: "Subject is not removed from the standard", success: false })

        return res.status(200).json({ message: `Subject is remove from the standard: ${standardData.standard}`, success: true })

    } catch (error) {
        console.error('Error in removeSubjectFromStandard : ', error)
        return res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const addSubject = async (req, res) => {
    try {
        const { subjectName } = req.body

        //check if subject is already exist or not
        let subject = await Subject.findOne({ subject_name: subjectName })

        if (subject)
            return res.status(400).json({ message: "Subject is already exist with this name", success: true })

        subject = await Subject.create({
            subject_name: subjectName
        })
        if (!subject) {
            return res.status(400).json({ message: "Subject is not created", success: false })
        }
        return res.status(201).json({ message: "Subject is created", success: true })
    }
    catch (e) {
        console.log('Error in SubjectController : ', e)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const deleteSubject = async (req, res) => {
    try {
        const { subjectId } = req.body

        const response = await Subject.findOneAndDelete({ _id: subjectId })

        if (!response)
            throw new Error("Can not Delete an Subject")

        return res.status(200).json({ message: "Deleted Successfully" })

    } catch (error) {
        console.error("Error in DeleteSuject : ", err)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const getAllTeacher = async (req, res) => {
    try {

        const rawTeachers = await Teacher.find().select('-__v').populate('userId', 'name email').populate('subjects.subjectId', 'subject_name').populate('subjects.standardId', 'standard')

        const response = rawTeachers.map(teacher => ({
            _id: teacher._id,
            userId: teacher.userId,
            subjects: teacher.subjects.map(sub => ({
                subjectName: sub.subjectId.subject_name,
                standard: sub.standardId.standard
            }))
        }));

        if (!response)
            return res.status(204).json({ message: 'No Teacher Found', success: false })

        return res.status(200).json({ message: "Teachers Found", success: true, data: response })

    } catch (error) {
        console.error("error in getAllTeacherController : ", error)

        return res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const getAllStudents = async (req, res) => {
    try {

        let response = await getStudents()

        console.log(response)

        if (!response)
            return res.status(204).json({ message: 'No Student Found', success: false })

         response = response.map(student => ({
            dob: student.dob,
            gender: student.gender,
            rollNumber: student.rollNumber,
            name: student.userId.name,
            email: student.email,
            standard: student.standardId.standard,
            _id: student._id,
        }));




        return res.status(200).json({ message: "Students Found", success: true, data: response })

    } catch (error) {
        console.error("Error in AllStudentsControllerIn Admin : ", error)

        return res.status(500).json({ message: "Internal Server Error", success: false })

    }
}

const assignSubjectToTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const { subjectId, standardId } = req.body;

        const teacher = await Teacher.findOne({ userId: teacherId });
        if (!teacher) {
            return res.status(400).json({ message: 'There is no Teacher', success: false });
        }

        const subjectObjectId = new mongoose.Types.ObjectId(subjectId);
        const standardObjectId = new mongoose.Types.ObjectId(standardId);

        const subjectExists = await Subject.exists({ _id: subjectObjectId });
        if (!subjectExists) return res.status(400).json({ message: 'Invalid Subject', success: false });

        const standardExists = await Standard.exists({ _id: standardObjectId });
        if (!standardExists) return res.status(400).json({ message: 'Invalid Standard', success: false });

        // Check if subject-standard pair already exists
        const exists = teacher.subjects.some(
            (s) =>
                s.subjectId.toString() === subjectId &&
                s.standardId.toString() === standardId
        );

        if (exists) {
            return res.status(400).json({ message: 'Subject Already Exists', success: false });
        }

        // Add new subject-standard pair
        teacher.subjects.push({
            subjectId,
            standardId
        });

        await teacher.save();
        return res.status(200).json({ message: 'Subject Added Successfully', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', success: false, error: error.message });
    }
};

const removeAssignedSubject = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const { subjectId, standardId } = req.body;

        const teacher = await Teacher.findOne({ userId: teacherId });
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found', success: false });
        }

        // Convert to ObjectId for comparison if stored as ObjectId in DB
        const subjectObjectId = new mongoose.Types.ObjectId(subjectId);
        const standardObjectId = new mongoose.Types.ObjectId(standardId);

        const subjectExists = await Subject.exists({ _id: subjectObjectId });
        if (!subjectExists) return res.status(400).json({ message: 'Invalid Subject', success: false });

        const standardExists = await Standard.exists({ _id: standardObjectId });
        if (!standardExists) return res.status(400).json({ message: 'Invalid Standard', success: false });

        // Find the index of the subject-standard pair to remove
        const index = teacher.subjects.findIndex(
            (s) =>
                s.subjectId.toString() === subjectObjectId.toString() &&
                s.standardId.toString() === standardObjectId.toString()
        );

        if (index === -1) {
            return res.status(400).json({ message: 'Subject-Standard pair not found', success: false });
        }

        // Remove the subject-standard pair from the array
        teacher.subjects.splice(index, 1);

        // Save updated teacher document
        await teacher.save();

        return res.status(200).json({ message: 'Subject removed successfully', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', success: false, error: error.message });
    }
};


const getStandardBasedTeachers = async (req, res) => {
    try {

        const standardId = req.params.standardId
        if (!standardId)
            return res.status(404).json({ message: "StandardId is invalid", success: false })

        const teachers = await getStandardBasedTeacher(standardId)

        if (!teachers)
            return res.status(204).json({ message: "No Teacher Found", success: true })

        return res.status(200).json({ message: 'Teachers Found', success: true, data: teachers })

    } catch (error) {
        console.error("Error in getStandardBasedTreachercontroller : ", error)

        return res.status(500).json({ message: 'Internal Server Error', success: false })
    }
}

const getStandardBasedStudent = async (req, res) => {
    try {

        const standardId = req.params.standardId

        const students = await getStudentsBasedOnStandard(standardId)

        if (!students || students.length == 0)
            return res.status(200).json({ message: "No Student Found", success: true })

        return res.status(200).json({ message: 'Student Found', success: true, data: students })

    } catch (error) {
        console.error("Error in getStandardBasedStudentcontroller : ", error)

        return res.status(500).json({ message: 'Internal Server Error', success: false })

    }
}
const getAllSubjectController = async (req, res) => {
    try {

        const response = await getAllSubjects()
        if (!response)
            return res.status(204).json({ message: 'No Subjects Found', success: false })

        return res.status(200).json({ message: "Subjects Found", data: response, success: true })

    } catch (error) {
        console.error("error at subject controller: ", error)
        return res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const getTeacher = async (req, res) => {
    try {
        const teacherId = req.params.teacherId
        let data = await Teacher.findById(teacherId).populate('userId', 'name email').populate('subjects.subjectId', 'subject_name').populate('subjects.standardId', 'standard')

        data = {
            _id: data._id,
            name: data.userId.name,
            email: data.userId.email,
            subjects: data.subjects.map((sub) => {
                return {
                    subject_name: sub.subjectId.subject_name,
                    standard: sub.standardId.standard
                }
            })
        }

        if (!data)
            return res.status(204).json({ message: 'No teacher found', success: false })

        return res.status(200).json({ data: data, message: "Teacher Found", success: true })

    } catch (error) {
        console.error("Error in getTeacher : ", error)
        return res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const getStudent = async (req, res) => {
    try {
        const studentID = req.params.studentId
        let response = await Student.findById(studentID).populate('standardId', 'standard').populate('userId', 'name email')

        if (!response)
            return res.status(204).json({ message: 'No student Found', success: false })

        response = response.toObject()
        response = {
            ...response,
            name: response.userId.name,
            email: response.userId.email,
            standard: response.standardId.standard,
            standardId: response.standardId._id,
            userId: response.userId._id
        }

        return res.status(200).json({ message: 'Stduent Found', data: response, success: true })

    } catch (error) {
        console.error("error in getStudentController : ", error)
        return res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

const deleteStudent = async (req, res) => {
    try {
        const { studentId } = req.body

        const response = await Student.findOneAndDelete({ _id: studentId })

        if (!response)
            throw new Error("Can not Delete an Student")

        const userDeleteRes = await User.findOneAndDelete({_id: response.userId})

        if (!userDeleteRes)
            throw new Error("Can not Delete an Student")

        return res.status(200).json({ message: "Deleted Successfully" ,success : true})

    } catch (error) {
        console.error("Error in DeleteStudent : ", error)
        return res.status(500).json({ message: "Internal Server Error" ,success : false})
    }
}

const updateStudent = async (req, res) => {
    try {
        const { _id, name, email, rollNumber, gender, dob, standard } = req.body;

        if (!_id || !rollNumber || !gender || !dob || !standard) {
            return res.status(400).json({ message: "Please provide all required fields", success: false });
        }

        const updatedStudent = await Student.findOneAndUpdate(
            { _id: _id }, // filter
            {
                $set: {
                    rollNumber,
                    gender,
                    dob: dob, // convert to Date object if needed
                    standard
                }
            },
            {
                new: true,    // return the updated document
                upsert: false // set to true if you want to create if not found
            }
        );


        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found", success: false });
        }

        return res.status(200).json({ message: "Updated Successfully", success: true, student: updatedStudent });

    } catch (error) {
        console.error("Error in UpdateStudent:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

module.exports = {updateStudent, deleteStudent, createStudent, createTeacher, addStandard, addSubjectToStandard, removeSubjectFromStandard, deleteSubject, addSubject, getAllTeacher, getAllStudents, removeAssignedSubject, assignSubjectToTeacher, getStandardBasedStudent, getStandardBasedTeachers, getAllSubjectController, getTeacher, getStudent};

