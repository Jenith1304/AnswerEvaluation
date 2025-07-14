import React, { useState, useEffect } from 'react';
import styles from '../styles/TestPage.module.css';
import { AiOutlineMinus } from 'react-icons/ai';

const AddIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const TestPage = () => {
    const [testTitle, setTestTitle] = useState('');
    const [selectedStandard, setSelectedStandard] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [totalMarks, setTotalMarks] = useState(0);

    const defaultQuestion = {
        id: 1,
        question: '',
        answer: '',
        marks: 0,
    };

    const [questions, setQuestions] = useState([defaultQuestion]);

    const [subjects, setSubjects] = useState([])


    const [subjectStandardInfo, setSubjectStandardInfo] = useState([{}])

    const [standards, SetStandards] = useState({
        'Standard 1': null,
        'Standard 2': null,
        'Standard 3': null,
        'Standard 4': null,
        'Standard 5': null,
        'Standard 6': null,
        'Standard 7': null,
        'Standard 8': null,
        'Standard 9': null,
        'Standard 10': null,
        'Standard 11': null,
        'Standard 12': null,
    });



    useEffect(() => {
        const getAllStandards = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/teacher/getTeacherBasedStandard`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Something went wrong while fetching standards');
                const data = await response.json();
                if (data.success === false) throw new Error(data.message);

                data.data.subjects.forEach((obj) => {
                    standards[obj.standard] = obj.standardId;
                })

                setSubjectStandardInfo(data.data.subjects)

            } catch (error) {
                console.error('Error fetching standards:', error.message);
            }
        };

        getAllStandards();
    }, []);

    useEffect(() => {
        const total = questions.reduce((acc, q) => acc + Number(q.marks), 0);
        setTotalMarks(total);
    }, [questions]);

    const handleInputChange = (index, field, value) => {
        const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, [field]: field === 'marks' ? Number(value) : value } : q
        );
        setQuestions(updatedQuestions);
    };

    const filterSubjects = (standard, standardId) => {
        setSelectedStandard(standardId)


        const filteredSubjects = subjectStandardInfo
            .filter(info => info.standard === standard)
            .map((info)=>{
                return  {
                    subject_name: info.subject_name,
                    subjectId : info.subjectId,
                }
            })


    if (filteredSubjects.length === 0)
        setSelectedSubjectId(null)
    console.log(filteredSubjects)

    setSubjects(filteredSubjects)
}

const addNewQuestion = () => {
    const lastQuestion = questions[questions.length - 1];

    if (
        !lastQuestion.question.trim() ||
        !lastQuestion.answer.trim() ||
        !lastQuestion.marks ||
        isNaN(lastQuestion.marks) ||
        Number(lastQuestion.marks) <= 0
    ) {
        alert("⚠️ Please complete the current question before adding a new one.");
        return;
    }

    const newId = questions.length > 0 ? questions[questions.length - 1].id + 1 : 1;
    setQuestions([...questions, { ...defaultQuestion, id: newId }]);
};


const deleteQuestion = (ind) => {
    const updatedQuestions = questions.filter((_, index) => index !== ind);
    setQuestions(updatedQuestions);
};

const handleSubmitTest = async () => {
    if (!testTitle || !selectedStandard || !selectedSubjectId) {
        alert('Please fill in Test Title, Standard, and Subject');
        return;
    }

    const validQuestions = questions.filter(q =>
        q.question.trim() &&
        q.answer.trim() &&
        q.marks !== '' &&
        !isNaN(q.marks) &&
        Number(q.marks) > 0
    );

    if (validQuestions.length === 0) {
        alert('You must add at least one question with a reference answer and valid marks.');
        return;
    }

    const formattedQuestions = validQuestions.map(q => ({
        questionText: q.question.trim(),
        referenceAnswer: q.answer.trim(),
        marks: Number(q.marks)
    }));

    
    const payload = {
        subjectId: selectedSubjectId,
        standardId: selectedStandard,
        testTitle: testTitle.trim().toUpperCase(),
        testDate: new Date(),
        questions: formattedQuestions
    };

    console.log(payload)

    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/teacher/createTest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
            throw new Error(data.message);
        }

        alert('✅ Test submitted successfully!');
        console.log('Submitted:', data);

        // Reset form
        setTestTitle('');
        setSelectedStandard('');
        setSelectedSubjectId('');
        setQuestions([{ ...defaultQuestion, id: 1 }]);
    } catch (error) {
        console.error('Submission failed:', error);
        alert('❌ Failed to submit test.');
    }
};

return (
    <div className={styles.pageContainer}>
        <div className={styles.mainCard}>
            <div className={styles.teacherInfo} style={{ display: 'flex', gap: '2rem' }}>
                <p><strong>Teacher 2</strong> teacher2@gmail.com</p>
                <p><strong>Total Marks:</strong> {totalMarks}</p>
            </div>

            <div className={styles.testHeader}>
                <div className={styles.controlsContainer}>
                    <input
                        type="text"
                        placeholder="Test Name"
                        className={styles.dropdown}
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                    />

                    <select
                        value={selectedStandard}
                        onChange={(e) => filterSubjects(e.target.selectedOptions[0].getAttribute('data-key'), e.target.value)}
                        className={styles.dropdown}
                    >
                        <option value="" disabled hidden>Select Standard</option>
                        {Object.entries(standards).map(([standard, standardId],index) =>
                            <option key={index} data-key={standard} value={standardId}>{standard}</option>
                        )}
                    </select>

                    <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        className={styles.dropdown}
                    >
                        <option value="" disabled hidden>Select Subject</option>
                        {
                            subjects.map((sub, index) =>
                                // sub.subjectId && (
                                <option key={index} value={sub.subjectId}>{sub.subject_name}</option>
                                // )
                            )}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={addNewQuestion} className={styles.addButton}>
                        <AddIcon />
                        Add New Question
                    </button>
                    <button onClick={handleSubmitTest} className={styles.addButton} style={{ backgroundColor: 'green' }}>
                        Submit Final Test
                    </button>
                </div>
            </div>

            <div className={styles.questionsList} style={{ scrollBehavior: 'smooth' }}>
                {questions.map((item, index) => (
                    <div key={item.id} className={styles.questionCard}>
                        <div className={styles.questionHeader}>
                            <div className={styles.questionInputContainer} style={{ gap: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={styles.questionNumber}>{`Question ${index + 1}.`}</span>
                                    <button
                                        onClick={() => deleteQuestion(index)}
                                        style={{ background: '#DC143C' }}
                                        className={styles.addButton}
                                    >
                                        <AiOutlineMinus />
                                        Delete
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <textarea
                                        placeholder="Enter the question here..."
                                        value={item.question}
                                        onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                                        className={styles.questionInput}
                                        rows="2"
                                    />
                                    <div className={styles.marksInputContainer}>
                                        <span className={styles.marksLabel}>Marks:</span>
                                        <input
                                            type="number"
                                            placeholder="Marks"
                                            value={item.marks}
                                            onChange={(e) => handleInputChange(index, 'marks', e.target.value)}
                                            className={styles.marksInput}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.answerSection}>
                            <label className={styles.answerLabel}>Reference Answer:</label>
                            <textarea
                                placeholder="Enter the reference answer here..."
                                value={item.answer}
                                onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
                                className={styles.answerInput}
                                rows="3"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
};

export default TestPage;
