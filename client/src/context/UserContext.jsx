import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const userContext = React.createContext();

const UserContext = ({ children }) => {
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState({ status: false, message: "" });
    const [user, setUser] = useState({});

    const handleFetchMe = async () => {
        setUserLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
                { withCredentials: true }
            );
            setUserError({ status: false, message: "" });
            setUser(response?.data?.result);
        } catch (error) {
            setUserError({ status: true, message: error?.message });
            setUser({ status: false });
        }
        setUserLoading(false);
    };

    const handleGoogleAuth = async (googleUser) => {
        setUserLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`,
                {
                    email: googleUser.email,
                    full_name: googleUser.displayName,
                    profile_photo: googleUser.photoURL,
                    google_uid: googleUser.uid,
                    signup_type: "g"
                },
                { withCredentials: true }
            );
            await handleFetchMe();
            return { success: true, message: response?.data?.message };
        } catch (error) {
            const msg = error?.response?.data || error.message;
            setUserError({ status: true, message: msg });

            const isHibernated = msg?.message?.includes("hibernation");
            const isDeleted = msg?.message?.includes("deleted");

            if (isHibernated || isDeleted) {
                return {
                    success: false,
                    message: msg?.message || "Account access restricted.",
                    isBlocked: true
                };
            }

            return { success: false, message: msg };
        } finally {
            setUserLoading(false);
        }
    };
    const handleGoogleAuthRecruiter = async (googleUser) => {
        setUserLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/google-recruiter`,
                {
                    email: googleUser.email,
                    full_name: googleUser.displayName,
                    profile_photo: googleUser.photoURL,
                    google_uid: googleUser.uid,
                    signup_type: "g"
                },
                { withCredentials: true }
            );

            await handleFetchMe();  // Assuming this fetches current user info
            return { success: true, message: response?.data?.message };
        } catch (error) {
            const msg = error?.response?.data || error.message;
            setUserError({ status: true, message: msg });

            return { success: false, message: msg };
        } finally {
            setUserLoading(false);
        }
    };


    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Logout error", err.message);
        } finally {
            setUser({ status: false });
        }
    };

    useEffect(() => {
        handleFetchMe();
    }, []);

    const passing = {
        userLoading,
        userError,
        user,
        handleFetchMe,
        handleGoogleAuth,
        handleGoogleAuthRecruiter,
        handleLogout,
    };

    return (
        <userContext.Provider value={passing}>{children}</userContext.Provider>
    );
};

const useUserContext = () => useContext(userContext);

export { useUserContext, UserContext };