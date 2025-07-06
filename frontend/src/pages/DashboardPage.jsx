import React, { useState } from 'react'
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import StudentChart from '../components/StudentChart';
import Toast from '../components/Toast';
import { useLocation } from 'react-router-dom';

const DashboardPage = () => {
    const statCardData = [
        { title: "Students", value: "124,684", change: 15, changeType: "increase", color: "#E0D9FF" },
        { title: "Teachers", value: "12,379", change: 3, changeType: "decrease", color: "#FEF5C3" },
        { title: "Staffs", value: "29,300", change: 3, changeType: "decrease", color: "#E0D9FF" },
        { title: "Awards", value: "95,800", change: 5, changeType: "increase", color: "#FEF5C3" },
    ];
    const location = useLocation()
    const [toast, setToast] = useState(location.state?.toast || null)
    return (
        <div className="dashboard-container">
            {toast ? <Toast message={toast.message} isSuccess={toast.isSuccess} /> : null}
            <main className="dashboard-main">
                <div className="stats-grid">
                    {statCardData.map(card => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
                <div className="charts-grid">
                    <StudentChart />
                    <AttendanceChart />
                </div>
            </main>

        </div>

    )
};
export default DashboardPage