import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiMenu } from 'react-icons/fi';

const Layout = ({ children, sidebarOpen, setSidebarOpen }) => {
    return (
        <div className="app-container">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {!sidebarOpen && (
                <button className="hamburger" onClick={() => setSidebarOpen((prev) => !prev)}>
                    <FiMenu size={24} />
                </button>
            )}
            <div className="main-content">
                <Header />
                {children}
            </div>
        </div>
    );
};

export default Layout;
