import React from 'react'
import { FiMoreHorizontal, FiUsers } from 'react-icons/fi';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const StudentChart = () => {
    const studentGenderData = [
        { name: 'Boys', value: 45414 },
        { name: 'Girls', value: 40270 },
    ];
    const GENDER_COLORS = ['#A0D7E7', '#FDD874'];
    const totalStudents = studentGenderData.reduce((acc, curr) => acc + curr.value, 0);
    return (
        <div className="card">
            <div className="card-header">
                <h3>Students</h3>
                <FiMoreHorizontal className="options-icon" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '200px', height: '200px', position: 'relative' }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={studentGenderData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} cornerRadius={5}>
                                {studentGenderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <FiUsers size={32} color="var(--text-secondary)" />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '12px', height: '12px', backgroundColor: GENDER_COLORS[0], borderRadius: '50%' }}></span>
                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>45.414</p>
                        </div>
                        <p style={{ margin: '0.25rem 0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Boys ({Math.round(studentGenderData[0].value / totalStudents * 100)}%)</p>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '12px', height: '12px', backgroundColor: GENDER_COLORS[1], borderRadius: '50%' }}></span>
                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>40.270</p>
                        </div>
                        <p style={{ margin: '0.25rem 0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Girls ({Math.round(studentGenderData[1].value / totalStudents * 100)}%)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentChart