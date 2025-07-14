import React from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload;
    const isOdd = !!item.odd;

    return (
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderLeft: `5px solid ${isOdd ? '#FDD874' : '#A0D7E7'}`,
          minWidth: '160px',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.3rem', color: '#333' }}>
          {item.standard}
        </div>
        <div style={{ fontSize: '0.95rem', color: '#666' }}>
          👥 Students: <strong>{item.studentCount}</strong>
        </div>
        {/* <div style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: '#888' }}>
          Group: <span style={{ color: isOdd ? '#FDD874' : '#A0D7E7', fontWeight: 600 }}>{isOdd ? 'Odd' : 'Even'}</span>
        </div> */}
      </div>
    );
  }

  return null;
};
 

const AttendanceChart = ({data}) => {
    //  const attendanceData = (data || []).map((item, index) => ({
    //     name: item.name,
    //     odd: item.odd || 0,
    //     even: item.even || 0
    // }));

    const attendanceData1 = [
        { standard: 'Std 1' ,odd : 0},
        { standard: 'Std 2' ,even : 0},
        { standard: 'Std 3', odd : 0},
        { standard: 'Std 4' ,even : 0},
        { standard: 'Std 5' ,odd : 0},
        { standard: 'Std 6' ,even : 0},
        { standard: 'Std 7' ,odd : 0},
        { standard: 'Std 8' ,even : 0},
        { standard: 'Std 9' ,odd : 0},
        { standard: 'Std 10',even : 0},
        { standard: 'Std 11',odd : 0},
        { standard: 'Std 12',even : 0},
    ]

    data.forEach((item,index)=>{
        const std = parseInt(item.standard.split(' ')[1])
        const data = {
            standard: "Std " + std,
            studentCount: item.studentCount,
            [std % 2 === 0 ? 'odd' : 'even']: item.studentCount, // Use odd/even keys based on index
        }
        attendanceData1[std - 1] = data;

        // return data
    })



    



    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h3 style={{marginTop:'1rem'}}>Attendance</h3>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#FDD874', borderRadius: '50%' }}></span> Odd Standards
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', backgroundColor: '#A0D7E7', borderRadius: '50%' }}></span> Even Standards
                    </div>
                </div>
                <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceData1}  barGap={8} barCategoryGap="35%">
                            <XAxis dataKey="standard" axisLine={false} tickLine={false} dy={10} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip 
                            // contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} 
                            content={<CustomTooltip ></CustomTooltip>} />
                            <Bar  dataKey="odd" fill="#FDD874" radius={[10, 10, 0, 0]}   />
                            {/* {attendanceData} */}
                            <Bar dataKey="even" display={"Student Count"}  fill="#A0D7E7" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
};




export default AttendanceChart;