import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../utils/googleAuth";
import { useUserContext } from "../context/UserContext";
import Swal from "sweetalert2";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const { handleGoogleAuth } = useUserContext();

    useEffect(() => {
        const processGoogleAuth = async () => {
            const { user, error } = await signInWithGoogle();
            
            if (error) {
                Swal.fire({
                    icon: "error",
                    title: "Authentication Failed",
                    text: error.message,
                });
                return navigate("/login");
            }

            if (user) {
                const result = await handleGoogleAuth(user);
                if (result.success) {
                    navigate("/dashboard");
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Authentication Failed",
                        text: result.message,
                    });
                    navigate("/login");
                }
            }
        };

        processGoogleAuth();
    }, [navigate, handleGoogleAuth]);

    return <div>Processing authentication...</div>;
};

export default GoogleCallback;