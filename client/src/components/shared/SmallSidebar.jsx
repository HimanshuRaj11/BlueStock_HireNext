import React, { useRef } from "react";
import styled from "styled-components";
import Logo from "../Logo";
import DashboardNavLinks from "./DashboardNavLinks";
import { useDashboardContext } from "../../Layout/DashboardLayout";
import { FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

const SmallSidebar = () => {
    const { user } = useUserContext();
    const { showSidebar, setShowSidebar, handleLogout } = useDashboardContext();
    const contentRef = useRef(null);

    const handleOverlayClick = (e) => {
        if (contentRef.current && !contentRef.current.contains(e.target)) {
            setShowSidebar(false);
        }
    };

    return (
        <Wrapper>
            <div
                className={`sidebar-container ${showSidebar ? "show-sidebar" : ""}`}
                onClick={handleOverlayClick}
            >
                <div className="content" ref={contentRef}>
                    <header className="flex justify-center">
                        <Logo />
                    </header>
                    <div className="nav-links-container">
                        <DashboardNavLinks />
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.aside`
    @media (min-width: 992px) {
        display: none;
    }

    .sidebar-container {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease-in-out;
    }

    .show-sidebar {
        opacity: 1;
        visibility: visible;
    }

    .content {
        background: var(--color-white);
        height: 100vh;
        width: 250px;
        padding: 2rem 1rem;
        position: relative;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .show-sidebar .content {
        transform: translateX(0);
    }

    .nav-links-container {
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        scrollbar-width: none; /* Hide scrollbar for Firefox */
        &::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Chrome/Safari */
        }
        padding-right: 5px; /* Prevent content from touching the edge */
    }

    .nav-links {
        width: 100%;
        padding-top: 1.2rem;
        display: flex;
        flex-direction: column;
    }

    .nav-link {
        display: flex;
        align-items: center;
        color: var(--color-black);
        padding: 0.6rem 0.5rem;
        border-radius: 4px;
        margin: 0.1rem 0;
        text-transform: capitalize;
        transition: all 0.3s linear;
    }

    .nav-link:hover {
        color: var(--color-primary);
        background-color: rgba(0, 0, 0, 0.05);
        opacity: 0.9;
    }

    .icon {
        font-size: 1.5rem;
        margin-right: 1rem;
        display: grid;
        place-items: center;
    }

    .active {
        color: var(--color-primary);
        background-color: rgba(0, 0, 0, 0.05);
        opacity: 0.9;
    }
`;

export default SmallSidebar;