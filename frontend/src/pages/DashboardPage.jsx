import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import StudentChart from '../components/StudentChart';
import Toast from '../components/Toast';
import { useLocation } from 'react-router-dom';

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [standardData, setStandardData] = useState([]);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/dashboard`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();
                setDashboardData(result.data);

                const standardAttendance = result.data.studentsPerStandard?.map((item, index) => {
                    return {
                        name: item.standard,
                        ...(index % 2 === 0
                            ? { odd: item.studentCount }
                            : { even: item.studentCount })
                    };
                }) || [];

                setStandardData(result.data.studentsPerStandard);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCardData = [
        {
            title: "Students",
            value: dashboardData?.students?.toLocaleString() || "0",
            change: 15,
            changeType: "increase",
            color: "#E0D9FF"
        },
        {
            title: "Teachers",
            value: dashboardData?.teachers?.toLocaleString() || "0",
            change: 3,
            changeType: "decrease",
            color: "#FEF5C3"
        },
        {
            title: "Test",
            value: dashboardData?.test?.toLocaleString() || "0",
            change: 8,
            changeType: "increase",
            color: "#E0D9FF"
        },

        {
            title: "Awards",
            value: "95,800",
            change: 5,
            changeType: "increase",
            color: "#FEF5C3"
        },
    ];
    const location = useLocation()
    const [toast, setToast] = useState(location.state?.toast || null)
    return (
        <div className="dashboard-container">
            {toast ? <Toast message={toast.message} isSuccess={toast.isSuccess} /> : null}
            <main className="dashboard-main">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="stats-grid">
                            {statCardData.map(card => (
                                <StatCard key={card.title} {...card} />
                            ))}
                        </div>
                        <div className="charts-grid" style={{ display: 'block' }}>
                            <AttendanceChart  data={standardData}/>
                        </div>
                        <StudentChart />
                    </>
                )}
            </main>

        </div>
    );
};

export default DashboardPage;
