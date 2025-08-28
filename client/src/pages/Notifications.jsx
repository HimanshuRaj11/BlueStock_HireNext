import React from "react";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="notifications-container">
                <div className="top-bar">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className="notifications-title">Notifications</h1>
                </div>
                <div className="divider"></div>
                <div className="body-content">
                    {/* Notification content will go here */}
                    <div className="empty-state">
                        <p>You don't have any notifications yet.</p>
                    </div>
                    {/* Sample notifications - you can remove these */}
                    <div className="notification-placeholder"></div>
                    <div className="notification-placeholder"></div>
                    <div className="notification-placeholder"></div>
                    <div className="notification-placeholder"></div>
                    <div className="notification-placeholder"></div>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    padding: 0;
    max-width: 1200px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .notifications-container {
        background: #fff;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .top-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem 2rem;
        background: #fff;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .divider {
        height: 1px;
        background: #e2e8f0;
        width: 100%;
        margin: 0;
    }

    .back-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        margin-left: -10px;
        cursor: pointer;
        color: #3b82f6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.2s;

        &:hover {
            background: #f1f5f9;
        }
    }

    .notifications-title {
        font-size: 1.25rem;
        color: #333;
        font-weight: 600;
        margin-left: -15px;
    }

    .body-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem 2rem;
    }

    .empty-state {
        text-align: center;
        padding: 3rem 0;
        color: #64748b;
    }

    .notification-placeholder {
        height: 80px;
        background: #f8fafc;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
        .top-bar {
            padding: 1rem 1.5rem;
            margin-left: -15px;
        }
        
        .body-content {
            padding: 1rem 1.5rem;
        }
    }
`;

export default Notifications;