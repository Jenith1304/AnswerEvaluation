import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TeacherDetail.css'; // We will create this CSS file next

// MOCK API: Replace this with your actual API call to fetch a teacher by ID


const TeacherDetail = () => {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);




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

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`)) {
            // Replace with your actual delete API call
            console.log(`Deleting teacher ${teacherId}`);
            alert(`${teacher.name} has been deleted.`);
            navigate('/teachers'); // Go back to the list
        }
    };

    const handleUpdate = () => {
        // This would navigate to an edit form or open a modal
        alert(`The 'Update' functionality is a placeholder.`);
        // Example: navigate(`/teachers/edit/${teacherId}`);
    };

    if (loading) {
        return <div className="detail-container"><h2>Loading Details...</h2></div>;
    }

    if (!teacher) {
        return <div className="detail-container"><h2>Teacher not found.</h2></div>;
    }

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
                        <button onClick={handleUpdate} className="btn btn-update">Update</button>
                        <button onClick={handleDelete} className="btn btn-delete">Delete</button>
                    </div>
                </header>
                <section className="card-body">
                    <h3>Assigned Subjects & Standards</h3>
                    <ul className="subjects-list">
                        {teacher.subjects.map((sub, index) => (
                            <li key={index} className="subject-item">
                                <span className="subject-item-name">{sub.subject_name}</span>
                                <span className="subject-item-standard">{sub.standard}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default TeacherDetail;