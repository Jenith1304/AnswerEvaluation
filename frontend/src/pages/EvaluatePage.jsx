import React, { useEffect, useState } from 'react';
import '../styles/EvalautePage.css';
import { useLocation } from 'react-router-dom';
import Toast from '../components/Toast';
// This is a placeholder for your existing Toast component.
// It logs the message to the console to show that it's being called correctly.
// You can replace this function's body with your actual toast component invocation.


const EvaluatePage = () => {
    const location = useLocation();
    const [test, setTest] = useState(location.state?.test)
    const [loading, setLoading] = useState(true);
    console.log("hello")
    console.log(test);

    const [message,setMessage] = useState("")
    const [isSuccess,setIsSuccess] = useState(false)

    const testId = test?._id;
    const standardId = test.standardId._id
    const [students, setStudents] = useState([]);
    const testName = test?.testTitle;
    const standardName = test?.subjectId.subject_name
    const studentsAttempted = test?.studentsAttempted



    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/teacher/getAllStdntsOfStd/${standardId}`, {
                    method: "GET",
                    credentials: 'include'
                });
                const data = await response.json();
                if (!response.ok || data.success === false) {
                    throw new Error(data.message);
                }

                const updatedStudents = data.students.map(student => {
                    const attempted = studentsAttempted.find(
                        s => s.studentId._id === student._id
                    );

                    let uploadStatus = 'idle';
                    let evalStatus = 'idle';
                    let resultConducted = false;
                    let message = "";

                    console.log(attempted, student)

                    return {
                        ...student,
                        uploadStatus,
                        evalStatus,
                        resultConducted,
                        message,
                        attempted: attempted ? true : false
                    };
                });

                setStudents(updatedStudents);
                console.log("Updated Students:", updatedStudents);
            } catch (error) {
                console.error("Failed to fetch student details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [standardId, studentsAttempted]);

    const handleFileSelect = async (studentId, event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Basic file validation
        if (file.type !== "application/pdf") {
            setMessage('Invalid file type. Please upload a PDF.')
            setIsSuccess(false)
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        // Update UI to show "Uploading..." status for the specific student

        console.log(file);
        try {

            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student._id === studentId ? { ...student, uploadStatus: 'uploading' } : student
                )
            );
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/teacher/upload/${studentId}/${testId}`, {
                method: "POST",
                credentials: 'include',
                body: formData,
            });
            const data =await response.json();
            if (!response.ok) throw new Error('Upload failed');
            else {
                setStudents(prevStudents =>
                    prevStudents.map(student =>
                        student._id === studentId ? { ...student, uploadStatus: 'success', attempted: true, answerSheetId: data.data._id } : student
                    )
                );
            }
            setMessage("File uploaded successfully!")
            setIsSuccess(true)

        }
        catch (error) {
            console.error('Upload Error:', error);
            // On failure, update status to show an error
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.id === studentId ? { ...student, uploadStatus: 'error' } : student
                )
            );
            setMessage('File upload failed. Please try again.')
            setIsSuccess(false)
        }

    };
    const handleEvaluation = async (studentId, answerSheetId) => {
        try {
            // Set status to "evaluating"
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student._id === studentId ? { ...student, evalStatus: 'evaluating' } : student
                )
            );

            let finalAnswerSheetId = answerSheetId;

            // 🔁 If answerSheetId is undefined, fetch it from API
            if (!finalAnswerSheetId) {
                const ansRes = await fetch(`${import.meta.env.VITE_BASE_URL}/teacher/getAnswerSheet`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ studentId, testId }),
                });

                const data = await ansRes.json();

                if (!ansRes.ok || !data.response?._id) {
                    throw new Error(data.message || "AnswerSheet not found");
                }

                finalAnswerSheetId = data.response._id;
                console.log("Fetched answerSheetId:", finalAnswerSheetId);
            }

            // ✅ Call evaluateResult API
            const evalRes = await fetch(`${import.meta.env.VITE_BASE_URL}/teacher/evaulateResult`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ answerSheetId: finalAnswerSheetId, testId }),
            });

            const evalData = await evalRes.json();
            if (!evalRes.ok) throw new Error(evalData.error || "Evaluation failed");

            // ✅ Update status to success
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student._id === studentId ? { ...student, evalStatus: 'success' } : student
                )
            );
            setMessage('Evaluation Completed')
            setIsSuccess(true)

        } catch (err) {
            console.error('Evaluation Error:', err);
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student._id === studentId ? { ...student, evalStatus: 'error' } : student
                )
            );
            setMessage('Evaluation failed. Please try again.')
            setIsSuccess(false)
        }
    };

    if (loading) {
        return <div className="detail-container"><h2>Loading Details...</h2></div>;
    }

    // if (!student) {
    //     return <div className="detail-container"><h2>Student not found.</h2></div>;
    // }

    return (
        <div className="evaluation-page-container">
            <div className="evaluation-card">
                <div className="card-header">
                    <h1>{testName}</h1>
                    <span className="standard-tag">{standardName}</span>
                </div>

                <div className="student-list-container">
                    <div className="list-header">
                        <span className="header-student">Student Name</span>
                        <span className="header-actions">Actions</span>
                    </div>
                    {students.length > 0 ? 
                    students.map(student => (
                        <div className="student-row" key={student._id}>
                            <div className="student-info">
                                <span>{student.userId.name}</span>
                            </div>

                            <div className="student-actions">
                                {/* Upload Button Logic */}
                                {student.attempted && (
                                    <div className="status-text warning">Already Uploaded</div>
                                )}
                                {(student.uploadStatus === 'idle' || student.uploadStatus === 'error' || student.uploadStatus === 'uploading' || student.uploadStatus === 'success') && (
                                    <label htmlFor={`file-upload-${student._id}`} className={`action-btn upload-btn ${student.uploadStatus}`}>
                                        {
                                            student.uploadStatus === 'uploading'
                                                ? "Uploading..."
                                                : student.uploadStatus === 'success'
                                                    ? "Uploaded ✔"
                                                    : student.uploadStatus === 'error'
                                                        ? "Upload Failed - Retry"
                                                        : student.resultConducted
                                                            ? "Re-upload PDF"
                                                            : "Upload PDF"
                                        }

                                        <input
                                            id={`file-upload-${student._id}`}
                                            type="file"
                                            onChange={(e) => handleFileSelect(student._id, e)}
                                            accept=".pdf"
                                            disabled={student.uploadStatus === 'uploading'} // prevent double click while uploading
                                        />
                                    </label>
                                )}


                                {/* Evaluate Button Logic */}
                                <button
                                    onClick={() => handleEvaluation(student._id, student.answerSheetId)}
                                    className={`action-btn evaluate-btn ${student.evalStatus === 'success' ? 'evaluated' : ''}`}
                                    disabled={student.attempted === false}

                                >

                                    {
                                        console.log(student.attempted)
                                    }

                                    {

                                        student.evalStatus === 'idle'
                                            ? "Evaluate"
                                            : student.evalStatus === 'evaluating'
                                                ? "Evaluating..."
                                                : student.evalStatus === 'success'
                                                    ? "Evaluated"
                                                    : "Evaluate"
                                    }
                                </button>

                            </div>

                        </div>

                    )) :
                        <div style={{textAlign: 'center'}}>No Stduent Found </div>
                    }


                </div>
                {message ? <Toast message={message} isSuccess={isSuccess}/> : null}
            </div>
        </div>
    );
};

export default EvaluatePage;