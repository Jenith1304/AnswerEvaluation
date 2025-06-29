import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import DashboardPage from './pages/DashboardPage';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './App.css'
import "./styles/Sidebar.css"
import { FiMenu } from 'react-icons/fi';
import TeacherDetail from './pages/TeacherDetail';
import TestPage from './pages/TestDetail';
import TestListPage from './pages/TestListPage';
import TestDetail from './pages/TestDetail';
import ResultPage from './pages/ResultPage';
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Router>
        <div className="app-container">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          {!sidebarOpen ? (<button className="hamburger" onClick={() => setSidebarOpen((prev) => !prev)}>
            <FiMenu size={24} />
          </button>) : null}

          <div className="main-content">
            <Header />
            <Routes >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/teachers" element={<TeacherPage />} />
              <Route path="/teachers/:teacherId" element={<TeacherDetail />} />
              <Route path="/students" element={<StudentPage />} />
              <Route path="/test" element={<TestListPage />} />
              <Route path="/test-details/:testId" element={<TestDetail />} />
              <Route path="/result/:testId" element={<ResultPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;