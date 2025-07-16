import { useContext, useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../App";

const LogoutPage = () => {
    const { setAuthInfo } = useContext(authContext);
    const [redirect, setRedirect] = useState(false);
    const hasRun = useRef(false); // ✅ ref to prevent duplicate runs

    useEffect(() => {
        if (hasRun.current) return; // ✅ already ran, don't run again
        hasRun.current = true;

        const logout = async () => {
            const confirmed = window.confirm("Are you sure you want to logout?");
            if (!confirmed) {
                setRedirect(true);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setAuthInfo({
                        id: '',
                        name: '',
                        email: '',
                        role: '',
                        isAuthenticated: false,
                    });
                }
            } catch (err) {
                console.error("Logout failed:", err);
            } finally {
                setRedirect(true); // Redirect whether logout fails or succeeds
            }
        };

        logout();
    }, []);

    if (redirect) {
        return <Navigate to="/login" replace />;
    }

    return null; // nothing to show
};

export default LogoutPage;
