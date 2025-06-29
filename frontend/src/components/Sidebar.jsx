import React, { useEffect } from 'react';
import {
    FiBell, FiBookOpen, FiCalendar, FiDollarSign, FiHome,
    FiMessageSquare, FiUser, FiUserCheck, FiUsers, FiX
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <>
            {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ backgroundColor: 'var(--accent-blue)', borderRadius: '8px', padding: '8px' }}>
                            <FiBookOpen size={24} color="#007BFF" />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>SchoolHub</h1>
                    </div>
                    <button className="sidebar-close" onClick={onClose}><FiX size={20} /></button>
                </div>

                <nav>
                    <p className="sidebar-section">Menu</p>
                    <SidebarLink to="/" icon={<FiHome />} label="Dashboard" />
                    <SidebarLink to="/teachers" icon={<FiUsers />} label="Teachers" />
                    <SidebarLink to="/students" icon={<FiUserCheck />} label="Students" />
                    <SidebarLink to="/test" icon={<FiCalendar />} label="Test" />
                    <SidebarLink to="/finance" icon={<FiDollarSign />} label="Finance" />
                    <SidebarLink to="/notice" icon={<FiBell />} label="Notice" />
                    <SidebarLink to="/library" icon={<FiBookOpen />} label="Library" />
                    <SidebarLink to="/message" icon={<FiMessageSquare />} label="Message" />

                    <p className="sidebar-section">Other</p>
                    <SidebarLink to="/profile" icon={<FiUser />} label="Profile" />
                </nav>
            </aside>
        </>
    );
};

const SidebarLink = ({ to, icon, label }) => (
    <NavLink to={to} style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        marginBottom: '0.5rem',
        textDecoration: 'none',
        color: isActive ? 'var(--highlight-blue)' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'var(--active-blue)' : 'transparent',
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.2s ease',
    })}>
        {icon}
        <span style={{ marginLeft: '1rem' }}>{label}</span>
    </NavLink>
);

export default Sidebar;
