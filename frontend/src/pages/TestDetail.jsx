import React, { useEffect, useState } from 'react';
import '../styles/TestDetail.css';
import { FiEdit, FiFileText, FiClipboard, FiTrash2 } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import Toast from '../components/Toast';
import UpdateQuestionModal from '../components/UpdateQuestionModal';


const TestDetail = () => {

    const location = useLocation();
    const test = location.state?.test;

    useEffect(() => {
        console.log("Received test:", test);  // check here
    }, []);

    const result = {
        questionIds: test.questionIds,
        studentsAttempted: test.studentsAttempted,
        standard: test.standardId.standard,
        subjectName: test.subjectId.subject_name,
        teacher: test.teacherName,

    }
    // Handler functions for a real application
    // const handleUpdateTeacher = () => {

    //     alert(`Updating ${testData.teacherName}...`);
    // };

    // const handleDeleteTeacher = () => {
    //     alert(`Deleting ${testData.teacherName}...`);
    // };


    //   function QuestionCard() {
    //         const [questionData, setQuestionData] = useState({
    //             question: '1. Define Mitochondria.',
    //             answer: 'Mitochondria is the powerhouse of cell.',
    //             marks: 5,
    //         });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastInfo, setToastInfo] = useState({
        show: false,
        message: '',
        isSuccess: false,
    });

    // Function to handle the update from the modal
    const handleUpdateQuestion = (updatedData) => {
        // In a real app, you would make an API call here
        console.log('Updated Data:', updatedData);

        // setQuestionData(updatedData);
        setIsModalOpen(false); // Close the modal

        // Show a success toast
        setToastInfo({
            show: true,
            message: 'Question updated successfully!',
            isSuccess: true,
        });

        // Hide the toast after 3 seconds
        setTimeout(() => {
            setToastInfo({ show: false, message: '', isSuccess: false });
        }, 3000);
    };
    return (

        <div className="test-page-container">
            {toastInfo.show && (
                <Toast message={toastInfo.message} isSuccess={toastInfo.isSuccess} />
            )}

            <div className="details-card">
                {/* --- Teacher Header --- */}
                <div className="card-header">
                    <div className="teacher-info">
                        <h2>{test.teacherId?.userId?.name}</h2>
                        <p>{test.teacherId?.userId?.email}</p>
                    </div>
                    {/* <div className="header-actions">
                        <button className="btn btn-update" onClick={handleUpdateTeacher}>
                            <FiEdit /> Update
                        </button>
                        <button className="btn btn-delete" onClick={handleDeleteTeacher}>
                            <FiTrash2 /> Delete
                        </button>
                    </div> */}
                </div>

                {/* --- Assigned Test Details --- */}
                <div className="assigned-header">
                    <div className="assigned-title-group">
                        <FiClipboard className="title-icon" />
                        <h3>{test.subjectId.subject_name} Test</h3>
                    </div>
                    <div className="assigned-meta">
                        <span className="standard-pill">Standard {test.standardId.standard.split(' ')[1]}</span>
                        {/* {testData.resultGenerated && ( */}
                        {/* <a href={testData.resultLink} className="result-link">
                                <FiFileText />
                                <span>Result</span>
                            </a> */}
                        <Link
                            key={test._id}
                            to={`/result/${test._id}`}
                            state={{ result }} // ✅ pass state here
                            className="result-link"
                        ><FiFileText />
                            <span>Result</span></Link>
                        {/* )} */}
                    </div>
                </div>

                {/* --- Questions List --- */}
                <div className="questions-list">
                    {test.questionIds.map((question, index) => (
                        <div key={question.id} className="question-item">
                            <div className="question-content">
                                <p className="question-text">
                                    <strong>{index + 1}. {question.questionText}</strong>
                                </p>
                                <div className="question-details">
                                    <p className="reference-answer">
                                        <span>Reference Answer:</span> {question.referenceAnswer}
                                    </p>
                                    <p className="marks">
                                        <span>Marks:</span> {question.marks}
                                    </p>
                                </div>
                            </div>
                            <div className="question-actions">
                                <button className="btn btn-update-small" onClick={() => setIsModalOpen(true)} >
                                    <FiEdit /> Update
                                </button>
                            </div>
                            <UpdateQuestionModal
                                show={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onUpdate={handleUpdateQuestion}
                            // questionData={questionData}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestDetail;