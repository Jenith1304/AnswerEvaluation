import React, { useState } from 'react'; // Removed useEffect as it's not needed for static view
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import '../styles/Student.css'
import { useEffect } from 'react';
import { useMemo } from 'react';
import CreateStudentModal from '../components/CreateStudentModal';
import Toast from '../components/Toast';

const StudentPage = () => {

    const navigate = useNavigate();
    const [selectedStandard, setSelectedStandard] = useState('All Standards');
    const [Student, setStudent] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [resMessage, setResMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false)


    // The list to be rendered is simply our mock data.
    const filteredStudents = useMemo(() => {
        return (selectedStandard == 'All Standards' ?
            Student
            :
            Student.filter(student => student.standard === selectedStandard)
        )
    }
        , [selectedStandard, Student]);

    const handleSaveStudent = async ({ name, email, password, rollNumber, gender, dob, standard }) => {
        try {
            const request = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/createStudent`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, rollNumber, gender, dob, standard }),
                credentials: 'include'
            });
            const data = await request.json();

            console.log(data);
            if (!request.ok || data.success == false) {
                setIsSuccess(data.success)
                throw new Error(data.message)
            }

            setIsSuccess(data.success)
            setResMessage(data.message)
            // setIsFinished(true);


        } catch (error) {
            console.log(error);
            setResMessage(error.message);
            // setIsFinished(true);

        }
        finally {
            // setIsFinished(true);
        }
    }

    // Static list of standards for the dropdown menu.
    const standards = ['All Standards', ...Array.from({ length: 12 }, (_, i) => `Standard ${i + 1}`)];

    // We still need state for the dropdown so the UI can update when you click it.

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchAllStudent = async () => {

            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getAllStudents`, {
                    method: "GET",
                    credentials: 'include'
                })
                const data = await response.json()
                if (!response.ok || data.success == false)
                    throw new Error(data.message)
                // console.log(data.data)
                setStudent(data.data)
                setLoading(false);
            } catch (error) {
                console.error(error)
            }

        }
        fetchAllStudent();

    }, [])

    // --- EVENT HANDLERS ---
    const handleStudentClick = (studentId) => {
        // This will still work and navigate to the detail page.
        navigate(`/students/${studentId}`);
    };

    const handleCreateClick = () => {
        // This will still work and navigate to the create page.
        // navigate('/students/create'); 
        setIsModalOpen(true);
    };

    // --- RENDERED COMPONENT ---
    return (
        <div className="container">
            {/* Header */}


            {/* Card */}
            <main className="card">
                <header className="header">
                    <h1 className="title">Students List</h1>
                    <div className="controls">
                        <select
                            className="filterDropdown"
                            value={selectedStandard}
                            onChange={(e) => setSelectedStandard(e.target.value)}
                        >
                            {standards.map((standard) => (
                                <option key={standard} value={standard}>
                                    {standard}
                                </option>
                            ))}
                        </select>
                        <button
                            className="createButton"
                            onClick={handleCreateClick}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0b5ed7')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0d6efd')}
                        >
                            <FaUserPlus />
                            <span>Create Student</span>
                        </button>
                    </div>
                </header>

                <div className="tableHeader">
                    <span className="colName">Student Name</span>
                    <span className="colStandard">Standard</span>
                </div>

                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                        <div
                            key={student._id}
                            className="studentRow"
                            style={{
                                borderBottom:
                                    index === filteredStudents.length - 1 ? 'none' : undefined,
                            }}
                            onClick={() => handleStudentClick(student._id)}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                        >
                            <span className="colName">{student.name}</span>
                            <div className="colStandard">
                                <span className="standardTag" style={{ backgroundColor: '#FDD874' }}>{student.standard}</span>
                            </div>
                            <FiChevronRight className="arrowIcon" />
                        </div>
                    ))
                ) : (
                    <p className="message">No students found.</p>
                )}
            </main>
            <CreateStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStudent} />

            {resMessage && <Toast message={resMessage} isSuccess={isSuccess} />}
        </div>
    );

}

export default StudentPage;