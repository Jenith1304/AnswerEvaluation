import React, { useEffect, useState } from 'react';
import { FiMoreHorizontal, FiUsers } from 'react-icons/fi';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const GENDER_COLORS = ['#A0D7E7', '#FDD874'];

const StudentChart = () => {
    const [studentGenderData, setStudentGenderData] = useState([
        { name: 'Boys', value: 0 },
        { name: 'Girls', value: 0 },
    ]);

    useEffect(() => {
        const fetchGenderData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/dashboard`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();
                const { male, female } = result.data.gender;

                setStudentGenderData([
                    { name: 'Boys', value: male },
                    { name: 'Girls', value: female },
                ]);
            } catch (err) {
                console.error("Error fetching gender data:", err);
            }
        };

        fetchGenderData();
    }, []);

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
                            <Pie
                                data={studentGenderData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                cornerRadius={5}
                            >
                                {studentGenderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <FiUsers size={32} color="var(--text-secondary)" />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                    {studentGenderData.map((item, index) => (
                        <div key={item.name}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: GENDER_COLORS[index],
                                    borderRadius: '50%'
                                }}></span>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>
                                    {item.value.toLocaleString()}
                                </p>
                            </div>
                            <p style={{
                                margin: '0.25rem 0 0 1.5rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem'
                            }}>
                                {item.name} ({totalStudents > 0 ? Math.round(item.value / totalStudents * 100) : 0}%)
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentChart;
