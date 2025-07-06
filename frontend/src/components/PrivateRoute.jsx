import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Utility: Optional loading spinner while checking auth
const Loading = () => <div>Loading...</div>;

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    // Hit backend to check if token is valid (you can cache this later if needed)
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/verify`, {
          method: "GET",
          credentials: "include", // required to send cookies
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Still loading
  if (isAuthenticated === null) return <Loading />;

  // Not logged in
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  //  Logged in
  return children;
};

export default PrivateRoute;
