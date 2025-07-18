import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../App';

// Utility: Optional loading spinner while checking auth
const Loading = () => <div>Loading...</div>;

const PrivateRoute = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = result
  const { authInfo, setAuthInfo } = useContext(authContext)
  const [loading, setLoading] = useState(true);
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
          // console.log(data.user)
          setAuthInfo(() => ({
            // keep previous state if needed
            ...data.user,         // update with user from API
            isAuthenticated: true
          }));

          // console.log(authInfo);
          // return children
          // setIsAuthenticated(true);
        } else {
          setAuthInfo({
            ...authInfo, isAuthenticated: false
          })
          return <Navigate to="/login" replace />
          // setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        // setIsAuthenticated(false);
      }
      finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <Loading />;

  if (!authInfo.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
