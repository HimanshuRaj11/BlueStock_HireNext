import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../pages/Footer";

const HomeLayout = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default HomeLayout;
