import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import styled from "styled-components";
import { useUserContext } from "../context/UserContext";
import { FiArrowLeft } from "react-icons/fi";

const Settings = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();

    const changeStatus = async (newStatus) => {
        const actionText = newStatus === 2 ? "Hibernate" : "Delete";
        const confirm = await Swal.fire({
            title: `Are you sure you want to ${actionText} your account?`,
            text: newStatus === 2 
                ? "You can reactivate your account later by logging in again." 
                : "This will delete your account. You will need to appeal to reactivate.",
            icon: newStatus === 2 ? "warning" : "error",
            showCancelButton: true,
            confirmButtonColor: newStatus === 2 ? "#f59e0b" : "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, ${actionText}`,
        });

        if (!confirm.isConfirmed) return;

        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 + num2;

        const captcha = await Swal.fire({
            title: "Captcha Verification",
            text: `What is ${num1} + ${num2} ?`,
            input: "text",
            inputPlaceholder: "Enter your answer",
            inputValidator: (value) => {
                if (!value) return "Please enter the answer!";
                if (parseInt(value) !== answer) return "Wrong answer. Try again.";
                return null;
            },
            showCancelButton: true,
            confirmButtonText: "Verify",
            cancelButtonText: "Cancel",
        });

        if (!captcha.isConfirmed) return;

        try {
            const res = await axios.patch(
                "http://localhost:3000/api/auth/status",
                { ac_status: newStatus },
                { withCredentials: true }
            );

            await Swal.fire({
                icon: "success",
                title: "Status Changed",
                text: res.data.message,
            });

            navigate("/login");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data || "Status change failed",
            });
        }
    };

    return (
        <Wrapper>
            <div className="container">
                <div className="top-bar">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Account Settings</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <div className="status-section">
                        <h2>Account Status</h2>
                        <p className="current-status">
                            Current status:{" "}
                            <span className={`status ${
                                user?.ac_status === 1 ? "active" : 
                                user?.ac_status === 2 ? "hibernated" : "deleted"
                            }`}>
                                {user?.ac_status === 1 ? "Active" : 
                                 user?.ac_status === 2 ? "Hibernated" : "Deleted"}
                            </span>
                        </p>
                        
                        {user?.ac_status === 1 && (
                            <div className="actions">
                                <p>Change Account Status:</p>
                                <div className="buttons">
                                    <button 
                                        onClick={() => changeStatus(2)} 
                                        className="hibernate"
                                    >
                                        Hibernate Account
                                    </button>
                                    <button 
                                        onClick={() => changeStatus(3)} 
                                        className="delete"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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

    .container {
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
    }

    .back-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #3b82f6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.2s;
        margin-left: -10px;

        &:hover {
            background: #f1f5f9;
        }
    }

    h1 {
        font-size: 1.25rem;
        color: #333;
        font-weight: 600;
        margin-left: -15px;
    }

    .content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem 2rem;
    }

    .status-section {
        max-width: 800px;
        margin: 0 auto;
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 8px;

        h2 {
            font-size: 1.3rem;
            color: #333;
            margin-bottom: 1rem;
        }
    }

    .current-status {
        font-size: 1rem;
        color: #555;
        margin-bottom: 1.5rem;
    }

    .status {
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        
        &.active {
            color: #166534;
            background: #dcfce7;
        }
        
        &.hibernated {
            color: #9a3412;
            background: #fed7aa;
        }
        
        &.deleted {
            color: #991b1b;
            background: #fee2e2;
        }
    }

    .actions {
        p {
            font-size: 1rem;
            color: #555;
            margin-bottom: 1rem;
        }
    }

    .buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .hibernate, .delete {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .hibernate {
        background: #fbbf24;
        color: #000;
        
        &:hover {
            background: #f59e0b;
        }
    }

    .delete {
        background: #ef4444;
        color: #fff;
        
        &:hover {
            background: #dc2626;
        }
    }

    @media (max-width: 768px) {
        .top-bar {
            padding: 1rem 1.5rem;
            margin-left: -15px;
        }
        
        .content {
            padding: 1rem 1.5rem;
        }
        
        .buttons {
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .hibernate, .delete {
            width: 100%;
        }
    }
`;

export default Settings;