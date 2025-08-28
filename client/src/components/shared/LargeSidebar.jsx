import React from "react";
import { BiUserCircle } from "react-icons/bi";
import { FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import styled from "styled-components";
import DashboardNavLinks from "./DashboardNavLinks";
import { useDashboardContext } from "../../Layout/DashboardLayout";
import { useUserContext } from "../../context/UserContext";
import { NavLink } from "react-router-dom";

const LargeSidebar = () => {
    const { user } = useUserContext();
    const { showSidebar, handleLogout } = useDashboardContext();
    return (
        <Wrapper>
            <div
                className={
                    !showSidebar
                        ? "sidebar-container show-sidebar"
                        : "sidebar-container"
                }
            >
                <div className="profile">
                    <BiUserCircle className="text-5xl font-normal" />
                    <h6 className="text-sm font-semibold capitalize mt-1">
                        {user?.username}
                    </h6>
                    <p className="text-xs capitalize -mt-1 font-medium">
                        {user?.role === 1 ? 'Admin' : user?.role === 2 ? 'Recruiter' : 'User'}
                    </p>
                </div>
                <div className="content">
                    <DashboardNavLinks />
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.aside`
    display: none;

    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: 992px) {
        display: block;
        box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
        position: relative;
        height: 100vh; /* Full viewport height */
        width: 250px;
        flex-shrink: 0; /* Prevent sidebar from shrinking */
        overflow-y: hidden; /* Prevent scrolling on the wrapper */

        .sidebar-container {
            background: var(--background-secondary-color);
            height: 100vh; /* Full viewport height */
            width: 250px;
            margin-left: -250px;
            transition: margin-left 0.3s ease-in-out;
            padding: 2rem 0;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            overflow-y: auto; /* Enable scrolling only for sidebar content */
        }

        .show-sidebar {
            margin-left: 0;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0; /* Crucial for overflow to work */
            overflow-y: auto; /* Enable scrolling for sidebar content */
        }

        .bottom-links {
            margin-top: auto;
            padding-top: 1rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        /* Rest of your styles remain unchanged */
        .nav-links {
            padding-top: 1.5rem;
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            overflow-y: auto;
        }

        .nav-link {
            display: flex;
            align-items: center;
            color: var(--text-secondary-color);
            padding: 0.5rem 0;
            margin: 0.1rem 0;
            padding-left: 2.5rem;
            text-transform: capitalize;
            transition: all 0.3s linear;
            font-weight: 400;
            font-size: 16px;
            opacity: 0.8;
        }

        .nav-link:hover {
            background-color: rgba(0, 0, 0, 0.05);
            opacity: 0.9;
            text-decoration: none;
        }

        .icon {
            font-size: 1.5rem;
            margin-right: 1rem;
            display: grid;
            place-items: center;
        }

        .active {
            color: var(--color-primary);
            font-weight: 600;
            background-color: rgba(0, 0, 0, 0.04);
            opacity: 0.9;
        }
    }
`;

export default LargeSidebar;
