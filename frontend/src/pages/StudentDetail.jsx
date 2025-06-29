import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import '../styles/StudentDetail.css';
import Toast from '../components/Toast';
import CreateStudentModal from '../components/CreateStudentModal';

const StudentDetail = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resMessage,setResMessage] = useState("")
    const [isSuccess,setIsSuccess] = useState(false)

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getStudent/${studentId}`, {
                    method: "GET",
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok || data.success === false) {
                    throw new Error(data.message);
                }
                setStudent(data.data);
            } catch (error) {
                console.error("Failed to fetch student details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [studentId]);

    const handleDelete = async () => {
        try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/deleteStudent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ studentId }),
                    credentials: 'include'
                });

                const data = await response.json();

                setResMessage(data.message)
                setIsSuccess(data.success)

                if (!response.ok || data.success === false) {
                    throw new Error(data.message);
                }

                setTimeout(()=>{

                    navigate('/students', { replace: true });
                },2000)

            } catch (error) {
                console.error("Error deleting student:", error);
                alert("Failed to delete student.");
            }
        };

        const handleUpdateStudent = async (updatedData) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/updateStudent`, {
                    method : 'POST',
                    credentials : 'include',
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    body : JSON.stringify(updatedData)
                })
                const data = await response.json()

                setIsSuccess(data.success)
                setResMessage(data.message)
                if(!response)
                {
                    throw new Error(data.message);
                }
                setStudent(updatedData)

            } catch (error) {
                console.error(error)
            }
            // Simulated update logic
            console.log("Saving updated student data:", updatedData);
            // setStudent(prevStudent => ({ ...prevStudent, ...updatedData }));
            setIsModalOpen(false);
        };

        if (loading) {
            return <div className="detail-container"><h2>Loading Details...</h2></div>;
        }

        if (!student) {
            return <div className="detail-container"><h2>Student not found.</h2></div>;
        }

        return (
            <div className="detail-container">
                <button onClick={() => navigate('/students')} className="back-button">
                    <FaArrowLeft style={{ marginRight: '8px' }} />
                    Back to Students List
                </button>
                <div className="student-card">
                    <header className="card-header">
                        <div>
                            <h1 className="student-name">{student.name}</h1>
                            <p className="student-email">{student.email}</p>
                        </div>
                        <div className="actions">
                            <button onClick={() => {setIsModalOpen(true);console.log(student)}} className="btn btn-update">
                                <FaEdit style={{ marginRight: '8px' }} /> Update
                            </button>
                            <button onClick={handleDelete} className="btn btn-delete">
                                <FaTrash style={{ marginRight: '8px' }} /> Delete
                            </button>
                        </div>
                    </header>
                    <section className="card-body">
                        <h3>Personal & Academic Details</h3>
                        <ul className="details-list">
                            <li className="detail-item">
                                <span className="detail-item-label">Standard</span>
                                <span className="detail-item-value">{student.standard}</span>
                            </li>
                            <li className="detail-item">
                                <span className="detail-item-label">Roll Number</span>
                                <span className="detail-item-value secondary">{student.rollNumber}</span>
                            </li>
                            <li className="detail-item">
                                <span className="detail-item-label">Gender</span>
                                <span className="detail-item-value secondary">{student.gender}</span>
                            </li>
                            <li className="detail-item">
                                <span className="detail-item-label">Date of Birth</span>
                                <span className="detail-item-value secondary">
                                    {new Date(student.dob).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                            </li>
                        </ul>
                    </section>
                </div>
                {resMessage && <Toast message={resMessage} isSuccess={isSuccess} />}

                {/* You will need to implement UpdateStudentModal */}
                {/* 
            <UpdateStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                student={student}
                onSave={handleUpdateStudent}
            /> 
            */}

            <CreateStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleUpdateStudent} 
                student={student}
                title={'Update Student'}
                />
            </div>
        );
    };

    export default StudentDetail;
