import React from 'react'
import { FiBell, FiMessageSquare, FiSearch } from 'react-icons/fi';
const Header = () => (
    <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            width: '300px'
        }}>
            {/* <FiSearch color="var(--text-secondary)" />
            <input type="text" placeholder="Search" style={{ border: 'none', outline: 'none', marginLeft: '0.5rem', width: '100%', background: 'transparent' }} /> */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <FiMessageSquare size={22} color="var(--text-secondary)" cursor="pointer" />
            <FiBell size={22} color="var(--text-secondary)" cursor="pointer" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>Linda Adora</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Admin</p>
                </div>
                <img src="https://i.pravatar.cc/40?img=1" alt="Admin Avatar" style={{ borderRadius: '50%', width: '40px', height: '40px' }} />
            </div>
        </div>
    </header>
);

export default Header