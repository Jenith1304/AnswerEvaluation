import React, { useEffect, useState } from 'react';

const Toast = ({ message, isSuccess = true, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer); // Clean up timer
    }, [duration]);

    if (!visible) return null;

    const toastStyle = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: isSuccess ? '#28a745' : '#dc3545',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        fontSize: '16px',
        transition: 'opacity 0.3s ease-in-out',
    };

    return (
        <>
            <div style={toastStyle}>
                {message}
            </div>;
        </>
    )
};

export default Toast;
