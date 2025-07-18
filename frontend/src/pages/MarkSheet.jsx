import React, { useContext, useEffect, useState } from 'react';
import '../styles/MarkSheet.css'; // Import the external CSS file
import PdfViewer from '../components/PdfViewer';
import { useLocation, useNavigate } from 'react-router-dom';
import { authContext } from '../App';

// Mock data for the questions. In a real app, this would come from an API.
const mockQuestions = [
    {
        id: 1,
        questionText: "What is the primary function of mitochondria in a eukaryotic cell?",
        referenceAnswer: "The primary function of mitochondria is to generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. They are often referred to as the 'powerhouses of the cell'.",
        totalMarks: 5,
        awardedMarks: 4,
    },
    {
        id: 2,
        questionText: "Explain the concept of 'Karma' as a principle in physics and its relation to Newton's Third Law.",
        referenceAnswer: "In physics, the concept analogous to 'Karma' is Newton's Third Law of Motion, which states that for every action, there is an equal and opposite reaction. This means that any force exerted on an object will result in an equal and opposite force exerted back.",
        totalMarks: 5,
        awardedMarks: 5,
    },
    {
        id: 3,
        questionText: "Describe the process of photosynthesis and write its chemical equation.",
        referenceAnswer: "Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy into chemical energy. The chemical equation is: 6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2.",
        totalMarks: 10,
        awardedMarks: 8,
    },
];



// Main component for the Mark Sheet page
const MarkSheet = () => {

    const {authInfo} = useContext(authContext)

    const location = useLocation();
    const result = location.state;
    const [questions, setQuestions] = useState(result.questionIds);
    // useEffect(() => {
    //     console.log("Received Result:", result);

    // }, []);


    const [initialState] = useState(JSON.parse(JSON.stringify(mockQuestions))); // Deep copy for reset

    const [resultId, setResultId] = useState(result.resultId)
    const studentId = result.studentId
    const standard = result?.standard || 'Standrad'
    const subjectName = result?.subjectName || 'Subject Name'
    const testId = result?.testId;

    // Deep copy the result array (shallow objects)
    const [editedResults, setEditedResults] = useState(
        JSON.parse(JSON.stringify(result.resultId.result))
    );
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const handleMarkChange = (index, value) => {

        if (value === "") {
            const updated = [...editedResults];
            updated[index].marks_obtained = ""; // Store empty string temporarily
            setEditedResults(updated);

            setErrors(prev => ({
                ...prev,
                [index]: `Marks cannot be empty`,
            }));
            return;
        }
        const mark = parseInt(value);
        const maxMarks = parseInt(questions[index].marks);


        if (isNaN(mark) || mark < 0 || mark > maxMarks) {
            setErrors(prev => ({
                ...prev,
                [index]: `Marks must be between 0 and ${maxMarks}`,
            }));
            return;
        }


        const updated = [...editedResults];
        updated[index].marks_obtained = parseInt(value); // convert to number
        setEditedResults(updated);
        setErrors(prev => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });

    }
    const handleUpdate = async (testId, studentId) => {

        if (Object.keys(errors).length > 0) {
            alert("Fix the errors before submitting.");
            return;
        }


        const hasChanged = editedResults.some((entry, index) => {
            const newMark = Number(entry.marks_obtained);
            const originalMark = Number(resultId.result[index].marks_obtained);
            // Only compare if newMark is a valid number
            return isNaN(newMark) || newMark !== originalMark;
        });
        if (hasChanged) {
            const updatedResult = {
                ...resultId,
                result: editedResults,
            };
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${authInfo.role}/updateMarks/${testId}/${studentId}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ result: updatedResult.result })
                });
                const data = await response.json()
                if (!response.ok || data.success == false)
                    throw new Error(data.message)
                // console.log(data.updatedResult)
                navigate('/test', { replace: true, state: { toast: { message: data.message, isSuccess: data.success } } })
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            navigate('/test', { replace: true, state: { toast: { message: "No Update needed", isSuccess: true } } })
        }
    };

    const handleCancel = () => {
        // Reset the marks to their initial state
        setQuestions(initialState);
        alert("Changes have been cancelled.");
    };

    return (
        <div className="mark-sheet-container">
            <div className="evaluation-panel">

                <header className="evaluation-header">
                    {/* SVG Icon for visual appeal */}
                    <svg className="header-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                    </svg>
                    <h1>Evaluate Answer Sheet</h1>
                </header>
                <div className="test-meta-container">
                    <div className="test-meta-heading">
                        {`Photosynthesis Test - Std 9`}
                    </div>
                    <div className="test-meta-tags">
                        <span className="tag-subject">{subjectName}</span>
                        <span className="divider">|</span>
                        <span className="tag-standard">{standard}</span>
                        <span className="divider">|</span>
                        <span className="tag-student">Student:{studentId.userId.name}</span>
                    </div>
                </div>
                <div className="questions-list">
                    {questions.map((q, index) => (
                        <div key={index} className="question-card">
                            <div className="question-header">
                                <h3>{`Q${index + 1}: ${q.questionText}`}</h3>
                                <div className="marks-input-container">
                                    <input
                                        type="number"
                                        className="marks-input"
                                        value={editedResults[index].marks_obtained}
                                        onChange={(e) => handleMarkChange(index, e.target.value)}
                                        max={q.totalMarks}
                                        min="0"
                                    />
                                    <span className="total-marks">/ {q.marks}</span>

                                </div>

                            </div>
                            {errors[index] && (
                                <div style={{ color: "red", fontSize: "12px", float: "right" }}>{errors[index]}</div>
                            )}
                            <div className="reference-answer">
                                <h4>Reference Answer:</h4>
                                <p>{q.referenceAnswer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="action-buttons">
                    <button className="action-btn btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="action-btn btn-update" onClick={() => handleUpdate(testId, studentId._id)}>Update Marks</button>
                </div>
            </div>
            <div className="pdf-viewer-panel" >
                <PdfViewer studentId={studentId} testId={testId} />
            </div>
        </div>
    );
};

export default MarkSheet;