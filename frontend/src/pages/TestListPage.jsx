import React from 'react';
import '../styles/Test.css';
import { FiBookOpen, FiUser, FiAward, FiChevronRight } from 'react-icons/fi';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Toast from '../components/Toast';



const TestListPage = () => {
    const [testListData, setTestListData] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation()

    const [toast, setToast] = useState(location.state?.toast || null)



    useEffect(() => {

        const fetchTests = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getAllTests`, {
                    method: "GET",
                    credentials: 'include'
                })
                const data = await response.json()
                if (!response.ok || data.success == false)
                    throw new Error(data.message)
                setTestListData(data.tests)
                // console.log(data.tests)
                setLoading(false);

            } catch (error) {
                console.error(error)
            }
        }


        fetchTests()
    }, []);

    if (loading) {
        return <div className="detail-container"><h2>Loading Details...</h2></div>;
    }

    if (testListData.length == 0) {
        return <div className="detail-container"><h2>Tests not found.</h2></div>;
    }
    return (
        <div className="test-list-page-container">
            <div className="list-card">
                {/* --- List Header --- */}
                <div className="list-header">
                    <FiBookOpen className="header-icon" />
                    <h2>Available Tests</h2>
                </div>

                {/* --- Test Items Container --- */}
                <div className="test-items-container">
                    {testListData.map((test, index) => (
                        <Link
                            key={test._id}
                            to={`/test-details/${test._id}`}
                            state={{ test }}
                            className="test-item-link"
                        >
                            <div className="test-item">
                                <div className="test-info">
                                    <div className="test-title">{test.testTitle}</div>
                                    <div className="test-meta">
                                        <span>{test.subjectId.subject_name}</span>
                                        <span className="separator">|</span>
                                        <span className="standard-pill">{test.standardId.standard}</span>
                                    </div>
                                </div>
                                <div className='testInfo-right'>
                                    <div style={{ color: "#495057" }}>
                                        <FiUser />
                                        <span>{test.teacherId?.userId?.name || null}</span>
                                    </div>
                                    <div className="marks-info">
                                        <FiAward />
                                        <span>{test.totalMarks} Marks</span>
                                    </div>

                                </div>


                                <div className="link-arrow">
                                    <FiChevronRight />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {toast ? <Toast message={toast.message} isSuccess={toast.isSuccess} /> : null}
            </div>
        </div>
    );
};

export default TestListPage;