
import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import TeacherDetail from './pages/TeacherDetail';
import TestPage from '../src/pages/TestPage';
import TestListPage from './pages/TestListPage';
import TestDetail from './pages/TestDetail';
import ResultPage from './pages/ResultPage';
import StudentDetail from './pages/StudentDetail';
import MarkSheet from './pages/MarkSheet';
import LoginPage from './pages/LoginPage';

import Layout from './components/Layout';


import './App.css';
import './styles/Sidebar.css';
import PrivateRoute from './components/PrivateRoute';
import LogoutPage from './pages/LogoutPage';
import EvaluatePage from './pages/EvaluatePage';

const authContext = createContext()

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authInfo, setAuthInfo] = useState({
    id: 'UserId',
    name: "userName",
    email: "email",
    role: "role",
    isAuthenticated: false
  })
  return (
    <Router>
      <authContext.Provider value={{ authInfo, setAuthInfo }}>
        <Routes>
          {/* Public route - Login */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}

          <Route path="/createnewtest" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <TestPage />
              </Layout>
            </PrivateRoute>
          } />


          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/teachers" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <TeacherPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/teachers/:teacherId" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <TeacherDetail />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/students" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <StudentPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/students/:studentId" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <StudentDetail />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/test" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <TestListPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/test-details/:testId" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <TestDetail />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/result/:testId" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <ResultPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/marksheet" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <MarkSheet />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/logout" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <LogoutPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/evaluate/:testId" element={
            <PrivateRoute>
              <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <EvaluatePage />
              </Layout>
            </PrivateRoute>
          } />

        </Routes>
      </authContext.Provider>
    </Router>
  );
}

export default App;

export { authContext };

