import React from 'react';
import '../styles/TestDetail.css';
import { FiEdit, FiFileText, FiClipboard, FiTrash2 } from 'react-icons/fi';

// --- Mock Data ---
// In a real app, this data would come from props or an API call.
const testData = {
    teacherName: 'Teacher 2',
    teacherEmail: 'teacher2@gmail.com',
    subjectName: 'Science',
    standardName: 'Standard 9',
    resultGenerated: true, // Set to false to see the "Result" link disappear
    resultLink: '/results/science/std9/q1-2023',
    questions: [    
        {
            id: 1,
            questionText: 'What is photosynthesis and why is it crucial for life on Earth?',
            referenceAnswer: 'Photosynthesis is the process used by plants, algae, and certain bacteria to harness energy from sunlight and turn it into chemical energy.',
            marks: 5,
        },
        {
            id: 2,
            questionText: 'Explain Newton\'s Third Law of Motion with a real-world example.',
            referenceAnswer: 'For every action, there is an equal and opposite reaction. For example, when you push against a wall, the wall pushes back on you with equal force.',
            marks: 10,
        },
        {
            id: 3,
            questionText: 'Describe the structure of a water molecule (H₂O).',
            referenceAnswer: 'A water molecule consists of two hydrogen atoms bonded to a single oxygen atom in a bent, V-shaped structure.',
            marks: 8,
        },
    ],
};

const TestDetail = () => {
    // Handler functions for a real application
    const handleUpdateTeacher = () => {
        alert(`Updating ${testData.teacherName}...`);
    };

    const handleDeleteTeacher = () => {
        alert(`Deleting ${testData.teacherName}...`);
    };

    const handleUpdateQuestion = (questionId) => {
        alert(`Opening update modal for question ID: ${questionId}`);
    };

    return (
        <div className="test-page-container">
            <div className="details-card">
                {/* --- Teacher Header --- */}
                <div className="card-header">
                    <div className="teacher-info">
                        <h2>{testData.teacherName}</h2>
                        <p>{testData.teacherEmail}</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-update" onClick={handleUpdateTeacher}>
                            <FiEdit /> Update
                        </button>
                        <button className="btn btn-delete" onClick={handleDeleteTeacher}>
                            <FiTrash2 /> Delete
                        </button>
                    </div>
                </div>

                {/* --- Assigned Test Details --- */}
                <div className="assigned-header">
                    <div className="assigned-title-group">
                        <FiClipboard className="title-icon" />
                        <h3>{testData.subjectName} Test</h3>
                    </div>
                    <div className="assigned-meta">
                        <span className="standard-pill">Standard {testData.standardName.split(' ')[1]}</span>
                        {testData.resultGenerated && (
                            <a href={testData.resultLink} className="result-link">
                                <FiFileText />
                                <span>Result</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* --- Questions List --- */}
                <div className="questions-list">
                    {testData.questions.map((question, index) => (
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
                                <button className="btn btn-update-small" onClick={() => handleUpdateQuestion(question.id)}>
                                    <FiEdit /> Update
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestDetail;