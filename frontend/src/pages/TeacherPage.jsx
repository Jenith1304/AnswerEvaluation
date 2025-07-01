import React, { useEffect, useState } from 'react'
import {
    FiHome, FiUsers, FiUserCheck, FiDollarSign, FiBell, FiCalendar,
    FiBookOpen, FiMessageSquare, FiUser, FiSearch, FiMoreHorizontal,
    FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown, FiPlusCircle, FiTrash2
} from 'react-icons/fi';
import "../styles/Teacher.css"
import Button from '../components/Button';
import CreateTeacherModal from '../components/CreateTeacherModal';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
const TeacherPage = () => {

    const navigate = useNavigate();

    const [teacherData, setTeacherData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [resMessage, setResMessage] = useState("");

    const handleViewDetails = (teacherId) => {
        navigate(`/teachers/${teacherId}`);
    };


    useEffect(() => {
        const fetchAllTeachers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getAllTeachers`, {
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
                setTeacherData(data.data || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                // setLoading(false);
            }
        };

        fetchAllTeachers();
    }, []);

    // const allTeachersData = [
    //     { id: 1, name: 'Mr. Harrison', standard: 'Standard 7', subjects: ['Physics', 'Chemistry'] },
    //     { id: 2, name: 'Ms. Davis', standard: 'Standard 9', subjects: ['History', 'Civics', 'Geography'] },
    //     { id: 3, name: 'Dr. Patel', standard: 'Standard 11', subjects: ['Advanced Calculus', 'Linear Algebra'] },
    //     { id: 4, name: 'Mrs. Gable', standard: 'Standard 7', subjects: ['English Literature', 'Grammar'] },
    //     { id: 5, name: 'Mr. Thompson', standard: 'Standard 12', subjects: ['Computer Science', 'AI & Machine Learning'] },
    //     { id: 6, name: 'Ms. Rodriguez', standard: 'Standard 10', subjects: ['Biology', 'Environmental Science'] },
    //     { id: 7, name: 'Mr. Chen', standard: 'Standard 8', subjects: ['Mathematics', 'Statistics'] },
    //     { id: 8, name: 'Ms. Walker', standard: 'Standard 9', subjects: ['Art History', 'Studio Art'] },
    //     { id: 9, name: 'Dr. Evans', standard: 'Standard 12', subjects: ['Quantum Physics', 'Thermodynamics'] },
    //     { id: 10, name: 'Mr. Moore', standard: 'Standard 10', subjects: ['World History', 'Economics'] },
    // ];

    const [selectedStandard, setSelectedStandard] = useState('All Standards');

    const standards = ['All Standards', ...Array.from({ length: 12 }, (_, i) => `Standard ${i + 1}`)];

    const filteredTeachers = selectedStandard === 'All Standards'
        ? teacherData.map((teacher) => {
            return (
                {
                    _id: teacher._id,
                    name: teacher.userId.name,
                    email: teacher.userId.email,
                    subjects: teacher.subjects
                }
            )
        })
        : teacherData.map((teacher) => {
            return (
                {
                    _id: teacher._id,
                    name: teacher.userId.name,
                    email: teacher.userId.email,
                    subjects: teacher.subjects.filter(obj => obj.standard == selectedStandard)
                }
            )
        });

    //handling save teacher
    const handleSaveTeacher = async ({ name, email, password, assignedSubjects }) => {
        try {
            const request = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/createTeacher`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, subjects: assignedSubjects }),
                credentials: 'include'
            });
            const data = await request.json();

            console.log(data);
            if (!request.ok || data.success == false) {

                throw new Error(data.message)
            }

            setResMessage(data.message)
            setIsFinished(true);


        } catch (error) {
            console.log(error);
            setResMessage(error.message);
            setIsFinished(true);

        }
        finally {
            setIsFinished(true);
        }



    }
    return (
        <div className="card">
            <div className="page-header">
                <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', width: '100%' }} >
                    <h1 className="page-title" style={{ marginTop: 2 }}>Teachers List</h1>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select style={{ flexGrow: '1' }} value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)}>
                            {standards.map(standard => (
                                <option key={standard} value={standard}>{standard}</option>
                            ))}
                        </select>
                        <Button Icon={<FiPlusCircle size={30} />} title={'Create Teacher'} onClick={() => setIsModalOpen(true)} />
                        {/* <button className="btn btn-primary">
                            <FiPlusCircle size={30} /> Create Teacher
                        </button> */}
                        {isFinished && (<Toast message={resMessage} isSuccess={false} />)}
                    </div>

                </div>
                <CreateTeacherModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTeacher}
                />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Teacher Name</th>
                            <th>Assigned Subjects</th>
                            <th>Standard</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map(teacher => {
                                return teacher.subjects.length > 0 ? (<tr key={teacher._id} className="clickable-row" onClick={() => handleViewDetails(teacher._id)}>
                                    <td>{teacher.name}</td>
                                    <td>
                                        {teacher.subjects.map((obj, index) => (
                                            <span key={index} style={{backgroundColor:'#A0D7E7'}} className="subject-badge">{obj.subjectName}</span>
                                        ))}
                                    </td>
                                    {/* <td>{teacher.standard}</td> */}
                                    <td>
                                        {teacher.subjects.map((obj, index) => (
                                            <span key={index} style={{backgroundColor:'#FDD874'}} className="subject-badge">{obj.standard}</span>
                                        ))}
                                    </td>
                                    <td className="arrow-cell">{'>'}</td>
                                </tr>) : null

                            })
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No teachers found for this standard.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherPage