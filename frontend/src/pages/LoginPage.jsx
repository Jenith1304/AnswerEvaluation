import React, { useEffect, useState } from 'react';
import '../styles/LoginPage.css';

// Importing icons from react-icons
import { MdOutlineEmail, MdLockOutline } from 'react-icons/md';
import { HiOutlineUser, HiOutlineUserGroup, HiOutlineAcademicCap } from 'react-icons/hi';

// Importing the illustration
import schoolIllustration from '../../src/assets/images/undraw_education.svg';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const LoginPage = () => {
    // State for form inputs and selected role
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('student'); // Default role
    const [toast, setToast] = useState(null)
    const navigate = useNavigate();
    // Form submission handler
    useEffect(() => {
        console.log("Cookies:", document.cookie); // Should show token
    }, []);
    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password || !selectedRole) {
            alert('Please fill in all fields and select a role.');
            return;
        }

        // In a real app, you would send these details to your backend for verification
        console.log('Logging in...', {
            role: selectedRole,
            email: email,
            password: password, // In a real app, NEVER log passwords
        });
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email: email, password: password, role: selectedRole })
            });
            const data = await response.json()
            if (!response.ok || data.success == false)
                throw new Error(data.message)
            // console.log(data.updatedResult)
            // console.log(document.cookie);
            navigate('/dashboard', { replace: true, state: { toast: { message: data.message, isSuccess: data.success } } })
        }
        catch (err) {
            console.log(err);
            setToast({ message: err.message, isSuccess: false })
        }
        setEmail("");
        setPassword("");
        setSelectedRole('student');
        // alert(`Welcome ${selectedRole}! \nEmail: ${email}\n(This is where you'd redirect to the appropriate dashboard)`);
    };

    // Role selector component
    const RoleSelector = ({ role, icon, label }) => (
        <div
            className={`role-card ${selectedRole === role ? 'active' : ''}`}
            onClick={() => setSelectedRole(role)}
        >
            {icon}
            <span>{label}</span>
        </div>
    );

    return (
        <div className="login-container">
            {toast ? <Toast message={toast.message} isSuccess={toast.isSuccess} /> : null}
            <div className="login-card">
                {/* Left Panel: Branding & Illustration */}
                <div className="login-panel branding-panel">
                    <h1>SchoolHub</h1>
                    <p>Your Modern Gateway to Education</p>
                    <img src={schoolIllustration} alt="School Illustration" className="illustration" />
                </div>

                {/* Right Panel: Login Form */}
                <div className="login-panel form-panel">
                    <h2>Login to Your Account</h2>
                    {/* <p className="subtitle">Please select your role and enter your details.</p> */}

                    <form onSubmit={handleLogin}>
                        {/* Attractive Role Selector */}
                        <div className="role-selector">
                            <RoleSelector role="student" icon={<HiOutlineUser />} label="Student" />
                            <RoleSelector role="teacher" icon={<HiOutlineAcademicCap />} label="Teacher" />
                            <RoleSelector role="admin" icon={<HiOutlineUserGroup />} label="Admin" />
                        </div>

                        {/* Input Fields */}
                        <div className="input-group">
                            <MdOutlineEmail className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <MdLockOutline className="input-icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <a href="#" className="forgot-password">Forgot Password?</a>

                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;