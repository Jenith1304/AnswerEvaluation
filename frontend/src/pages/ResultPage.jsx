import React, { useEffect } from 'react';
import { FiBookOpen, FiUser, FiAward, FiChevronRight } from 'react-icons/fi';
import '../styles/Result.css';
import { Link, useLocation } from 'react-router-dom';

// --- Mock Data ---
// In a real application, this data would be fetched from an API.
// The structure is kept simple to clearly map to the UI components.


const mockTests = [
    {
        studentId: {
            name: 'Krish Patel'
        },
        resultId: [
            {
                question: 'Question 1',
                marks_obtained: 10
            }
        ]
    },
    {
        studentId: {
            name: 'Siddhath Patel'
        },
        resultId: [
            {
                question: 'Question 1',
                marks_obtained: 10
            },
            {
                question: 'Question 2',
                marks_obtained: 5
            }
        ]
    },
    {
        studentId: {
            name: 'Siddhath Patel'
        },
        resultId: [

        ]
    }
];

const ResultPage = () => {



    const location = useLocation();
    const result = location.state?.result;

    // useEffect(() => {
    //     console.log("Received test:", result);  // check here
    // }, []);
    // const [marksheet,setMarksheet]=useState(result);
    // In a real app, you would have state for tests, loading, and errors.
    // const [tests, setTests] = useState([]);
    // const [loading, setLoading] = useState(true);
    // useEffect(() => { fetch('/api/tests')... }, []);

    return (
        <div className="test-list-container">
            <div className="test-card">
                {/* --- Card Header --- */}
                <div className="test-card-header">
                    <FiBookOpen className="header-icon" />
                    <h1 className="header-title">Available Result</h1>
                </div>

                {/* --- List of Test Items --- */}
                <div className="test-items-wrapper">
                    {result.studentsAttempted.map((test, index) => (
                        <Link
                            key={index}
                            to={`/marksheet`}
                            state={{ standard: result.standard, subjectName: result.subjectName, resultId: test.resultId, studentId: test.studentId, testId: result.testId, questionIds: result.questionIds }}// The entire item is a clickable link
                            className="test-item-link"
                        >
                            <div className="test-item-content">
                                {/* Left side: Title and tags */}
                                <div className="test-info">
                                    <h2 className="test-title">{test.studentId.userId.name}</h2>
                                    <div className="test-meta">
                                        <span className="subject-tag">{result.subjectName}</span>
                                        <span className="standard-pill">{result.standard}</span>
                                    </div>
                                </div>

                                {/* Right side: Teacher, Marks, and Arrow */}
                                <div className="test-details">
                                    <div className="detail-item teacher-info">
                                        <FiUser />
                                        <span>{result.teacher}</span>
                                    </div>
                                    <div className="detail-item marks-info">
                                        <FiAward />
                                        {
                                            test.resultId.result.length > 0 ? <span>{test.resultId.result.reduce((sum, obj) => {
                                                return sum + obj.marks_obtained
                                            }, 0)} Marks</span>
                                                :
                                                <span>Pending</span>
                                        }

                                    </div>
                                    <div className="arrow-icon">
                                        <FiChevronRight size={22} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default ResultPage;