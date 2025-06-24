import React from 'react'
import { FiChevronDown, FiChevronUp, FiMoreHorizontal } from 'react-icons/fi';

const StatCard = ({ title, value, change, changeType, color }) => (
    <div className="card" style={{ backgroundColor: color }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: changeType === 'increase' ? 'var(--green)' : 'var(--red)',
            }}>
                {changeType === 'increase' ? <FiChevronUp /> : <FiChevronDown />}
                <span>{change}%</span>
            </div>
            <FiMoreHorizontal className="options-icon" />
        </div>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{value}</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</p>
    </div>
);

export default StatCard