import React, { useState } from 'react';
import "../styles/CreateTeacherModal.css";

const CreateStudentModal = ({ isOpen, onClose, onSave, title = "Create New Student", student = null }) => {
    const availableStandards = Array.from({ length: 12 }, (_, i) => `Standard ${i + 1}`);
    const [name, setName] = useState(student ? student.name : '');
    const [email, setEmail] = useState(student ? student.email : '');
    const [password, setPassword] = useState('');
    const [rollNumber, setRollNumber] = useState(student ? student.rollNumber : '');
    const [gender, setGender] = useState(student ? student.gender : 'Male');
    const [dob, setDob] = useState(student ? student.dob.split("T")[0] : '');
    const [currentStandard, setCurrentStandard] = useState(availableStandards[0]);

    if (!isOpen) return null;

    const handleSaveClick = () => {
        if (!name || !email || (student ? false : !password) || !rollNumber || !dob || !currentStandard || !gender) {
            alert('Please fill all fields.');
            return;
        }

        onSave({
            name,
            email,
            rollNumber,
            gender,
            dob,
            standard: currentStandard,
            ...(student ? {} : { password }),
            ...(student ? {_id : student._id} : {})
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name">Student Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {!student ?
                        (<div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>) : null}

                    <div className="form-group">
                        <label htmlFor="rollNumber">Roll Number</label>
                        <input id="rollNumber" type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input id="dob" type="date" max={new Date().toISOString().split("T")[0]} value={dob} onChange={(e) => { setDob(e.target.value); console.log(e.target.value) }} />
                    </div>

                    <div className="form-group">
                        <label>Assign Standard</label>
                        <select value={currentStandard} onChange={(e) => setCurrentStandard(e.target.value)}>
                            {availableStandards.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="custom-btn btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="custom-btn" onClick={handleSaveClick}>Save Student</button>
                </div>
            </div>
        </div>
    );
};

export default CreateStudentModal;
