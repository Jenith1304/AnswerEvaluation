import React from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const AttendanceChart = () => {
    const attendanceData = [
        { name: 'Mon', present: 68, absent: 60 },
        { name: 'Tue', present: 78, absent: 65 },
        { name: 'Wed', present: 95, absent: 62 },
        { name: 'Thu', present: 72, absent: 80 },
        { name: 'Fri', present: 70, absent: 60 },
    ]
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h3>Attendance</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ background: '#F1F1F1', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Weekly</button>
                        <button style={{ background: '#F1F1F1', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Grade 3</button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#FDD874', borderRadius: '50%' }}></span> Total Present
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#A0D7E7', borderRadius: '50%' }}></span> Total Absent
                    </div>
                </div>
                <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceData} barGap={8} barCategoryGap="35%">
                            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} />
                            <Bar dataKey="present" fill="#FDD874" radius={[10, 10, 0, 0]} />
                            <Bar dataKey="absent" fill="#A0D7E7" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
};


export default AttendanceChart;