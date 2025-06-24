import React, { useEffect, useState } from 'react'
import "../styles/CreateTeacherModal.css"
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
const CreateTeacherModal = ({ isOpen, onClose, onSave }) => {


    const [availableSubjects, setAvailabaleSubjects] = useState([]);
    const [currentSubject, setCurrentSubject] = useState("");

    useEffect(() => {
        const getAllSubjects = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getAllSubjects`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                const data = await response.json();
                if (!response.ok || data.success === false) {
                    throw new Error(data.message);
                }

                setAvailabaleSubjects(data.data || []);
                setCurrentSubject(data.data[0].subject_name);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                // setLoading(false);
            }
        };

        getAllSubjects();
    }, []);
    const availableStandards = Array.from({ length: 12 }, (_, i) => `Standard ${i + 1}`);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentStandard, setCurrentStandard] = useState(availableStandards[0]);
    const [assignedSubjects, setAssignedSubjects] = useState([]);

    if (!isOpen) return null;

    const handleAddSubject = () => {
        console.log(currentSubject);
        if (currentSubject && currentStandard) {
            console.log("currentSubject" + currentSubject + currentStandard);
            const newAssignment = { subject_name: currentSubject, standard_name: currentStandard };
            // Prevent duplicates
            if (!assignedSubjects.some(s => s.subject_name === newAssignment.subject_name && s.standard_name === newAssignment.standard_name)) {
                setAssignedSubjects([...assignedSubjects, newAssignment]);
            }
        }

    };

    const handleRemoveSubject = (index) => {
        setAssignedSubjects(assignedSubjects.filter((_, i) => i !== index));
    };

    const handleSaveClick = () => {
        // Basic validation
        if (!name || !email || !password || assignedSubjects.length === 0) {
            alert('Please fill all fields and assign at least one subject.');
            return;
        }
        onSave({ name, email, password, assignedSubjects });
        onClose(); // Close modal after saving
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Create New Teacher</h2>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name">Teacher Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Assign Subjects</label>
                        <div className="subject-assignment-row">
                            <div className="form-group">
                                <select value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)}>
                                    {availableSubjects.map(s => <option key={s._id} value={s.subject_name}>{s.subject_name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <select value={currentStandard} onChange={(e) => setCurrentStandard(e.target.value)}>
                                    {availableStandards.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <button className="add-btn" onClick={handleAddSubject}>
                                <FiPlusCircle size={15} />
                            </button>
                        </div>
                        <div className="assigned-subjects-list">
                            {assignedSubjects.map((item, index) => (
                                <div key={index} className="assigned-subject-item">
                                    <span><strong>{item.subject_name}</strong> - {item.standard_name}</span>
                                    <button className="remove-subject-btn" onClick={() => handleRemoveSubject(index)}>
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="custom-btn btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="custom-btn" onClick={handleSaveClick}>Save Teacher</button>
                </div>
            </div>
        </div>
    );
};

export default CreateTeacherModal