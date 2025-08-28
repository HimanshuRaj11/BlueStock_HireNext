import React from "react";
import { useUserContext } from "../../context/UserContext";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "./Loading";
import UniversalLoading from "./UniversalLoading";

const CommonProtectRoute = ({ children }) => {
    const location = useLocation();
    const { userLoading, user } = useUserContext();

    if (userLoading) {
        return <UniversalLoading type="page" />;
    }

    if (user?.email) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default CommonProtectRoute;
