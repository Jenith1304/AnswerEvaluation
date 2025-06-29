import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TeacherDetail.css'; // We will create this CSS file next
import { FaEdit, FaTrash } from 'react-icons/fa'
import UpdateTeacherModal from '../components/UpdateTeacherModal';
import Toast from '../components/Toast';
// MOCK API: Replace this with your actual API call to fetch a teacher by ID


const TeacherDetail = () => {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resMessage, setResMessage] = useState("");
    const showToast = (message, isSuccess) => {
        setResMessage({ message, isSuccess }); // if you're already using this for toast
    };

    useEffect(() => {

        const fetchTeacherDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getTeacher/${teacherId}`, {
                    method: "GET",
                    credentials: 'include'
                })
                const data = await response.json()
                if (!response.ok || data.success == false)
                    throw new Error(data.message)
                setTeacher(data.data)
                setLoading(false);

            } catch (error) {
                console.error(error)
            }
        }


        fetchTeacherDetails()
    }, [teacherId]);

    const handleDeleteTeacher = async () => {
        try {
            if (window.confirm(`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`)) {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/deleteTeacher/${teacherId}`, {
                    method: "DELETE",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()
                if (!response.ok || data.success == false) {
                    setResMessage({ message: data.message, isSuccess: false });
                    throw new Error(data.message)
                }
                // console.log(`Deleting teacher ${teacherId}`);
                alert(`${teacher.name} has been deleted.`);
                navigate('/teachers'); // Go back to the list
            }
        } catch (error) {
            console.error("Erorr:", error);
            setResMessage({ message: error.message || "Something went wrong", isSuccess: false });
        }

    };
    const handleDeleteSubject = async (subject, standard) => {
        const subjects = [{ subject_name: subject, standard }]
        console.log(subjects)
        try {
            if (window.confirm(`Are you sure you want to delete ${subject} for ${standard}? This action cannot be undone.`)) {

                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/deassignSubject/${teacherId}`, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ assignments: subjects }),
                })
                const data = await response.json()
                if (!response.ok || data.success == false) {
                    setResMessage({ message: data.message, isSuccess: false });
                    throw new Error(data.message)
                }

                setTeacher(data.teacher)
                console.log(data.teacher);
                setLoading(false);
                setResMessage({ message: data.message, isSuccess: true });
                alert(`subject: ${teacherId} ,standard:${standard} has been deleted`);
                navigate(`/teachers`)  // Go back to the list
            }
        }
        catch (error) {
            console.error("Erorr:", error);
            setResMessage({ message: error.message || "Something went wrong", isSuccess: false });
        }
    };
    // const handleUpdate = () => {
    //     // This would navigate to an edit form or open a modal
    //     alert(`The 'Update' functionality is a placeholder.`);
    //     // Example: navigate(`/teachers/edit/${teacherId}`);
    // };

    if (loading) {
        return <div className="detail-container"><h2>Loading Details...</h2></div>;
    }

    if (!teacher) {
        return <div className="detail-container"><h2>Teacher not found.</h2></div>;
    }

    //from modal 
    const handleUpdateTeacher = async ({ teacherData, subjects }) => {
        // setTeacher(teacherData); // if needed to update local UI

        if (subjects.length > 0) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/assignSubject/${teacherId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ assignments: subjects }), // expects array of subject-standard pairs
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok || data.success === false) {
                    setResMessage({ message: data.message, isSuccess: false });
                    throw new Error(data.message || "Failed to assign subjects");
                }

                setTeacher(teacherData)

                // ✅ Use your existing Toast system
                setResMessage({ message: data.message, isSuccess: true });

            } catch (error) {
                console.error("Assignment Error:", error);
                setResMessage({ message: error.message || "Something went wrong", isSuccess: false });
            }
        }
    };

    return (
        <div className="detail-container">
            <button onClick={() => navigate('/teachers')} className="back-button">
                ← Back to Teachers List
            </button>
            <div className="teacher-card">
                <header className="card-header">
                    <div>
                        <h1 className="teacher-name">{teacher.name}</h1>
                        <p className="teacher-email">{teacher.email}</p>
                    </div>
                    <div className="actions">
                        <button onClick={() => setIsModalOpen(true)} className="btn btn-update" >
                            <FaEdit style={{ marginRight: '8px' }} /> Update
                        </button>
                        <button onClick={handleDeleteTeacher} className="btn btn-delete">
                            <FaTrash style={{ marginRight: '8px' }} /> Delete
                        </button>
                    </div>
                </header>
                <section className="card-body">
                    <h3>Assigned Subjects & Standards</h3>
                    <ul className="subjects-list">
                        {teacher.subjects.map((sub, index) => (
                            <li key={index} className="subject-item">
                                <span className="subject-item-name">{sub.subject_name}</span>
                                <span className="subject-item-standard">{sub.standard}</span>
                                <span><button onClick={() => handleDeleteSubject(sub.subject_name, sub.standard)} className="btn btn-delete">
                                    <FaTrash />
                                </button></span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <UpdateTeacherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                teacher={teacher}
                onSave={handleUpdateTeacher}
                showToast={showToast}

            />
            {resMessage && (
                <Toast message={resMessage.message} isSuccess={resMessage.isSuccess} />
            )}
        </div>
    );
};

export default TeacherDetail;