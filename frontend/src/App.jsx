// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// import DashboardPage from './pages/DashboardPage';
// import TeacherPage from './pages/TeacherPage';
// import StudentPage from './pages/StudentPage';
// import Sidebar from './components/Sidebar';
// import Header from './components/Header';
// import './App.css'
// import "./styles/Sidebar.css"
// import { FiMenu } from 'react-icons/fi';
// import TeacherDetail from './pages/TeacherDetail';
// import TestPage from './pages/TestDetail';
// import TestListPage from './pages/TestListPage';
// import TestDetail from './pages/TestDetail';
// import ResultPage from './pages/ResultPage';
// import StudentDetail from './pages/StudentDetail';
// import MarkSheet from './pages/MarkSheet';
// import LoginPage from './pages/LoginPage';
// import Layout from './components/Layout';
// // import TestListPage from './pages/TestListPage';
// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <>
//       <Router>
//         <div className="app-container">
//           <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//           {!sidebarOpen ? (<button className="hamburger" onClick={() => setSidebarOpen((prev) => !prev)}>
//             <FiMenu size={24} />
//           </button>) : null}

//           <div className="main-content">
//             {/* <Header /> */}
//             <Routes >
//               <Route path="/" element={<LoginPage />} />
//               <Route path="/dashboard" element={
//                 <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
//                   <DashboardPage />
//                 </Layout>
//               } />
//               <Route path="/teachers" element={
//                 <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
//                   <TeacherPage />
//                 </Layout>
//               } />
//               <Route path="/teachers/:teacherId" element={<TeacherDetail />} />
//               <Route path="/students" element={<StudentPage />} />
//               <Route path="/test" element={<TestListPage />} />
//               <Route path="/test-details/:testId" element={<TestDetail />} />
//               <Route path="/result/:testId" element={<ResultPage />} />
//               <Route path="/students/:studentId" element={<StudentDetail />} />
//               <Route path="/marksheet" element={<MarkSheet />} />
//               <Route path="/login" element={<LoginPage />} />
//             </Routes>
//           </div>
//         </div>
//       </Router>
//     </>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import TeacherDetail from './pages/TeacherDetail';
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public route - Login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
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
      </Routes>
    </Router>
  );
}

export default App;

