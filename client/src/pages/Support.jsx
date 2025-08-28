import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Support = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="support-container">
                <div className="top-bar">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className="support-title">Support</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <div className="support-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-item">
                            <h3>How do I reset my password?</h3>
                            <p>Go to the login page and click "Forgot Password" to receive reset instructions via email.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Where can I find my account settings?</h3>
                            <p>Account settings are available in the profile menu at the top right corner of the app.</p>
                        </div>
                    </div>
                    
                    <div className="support-section">
                        <h2>Contact Us</h2>
                        <p>Email: support@example.com</p>
                        <p>Phone: +1 (555) 123-4567</p>
                        <p>Hours: Monday-Friday, 9am-5pm EST</p>
                    </div>
                    
                    <div className="support-section">
                        <h2>Troubleshooting</h2>
                        <p>If the app isn't working properly, try these steps:</p>
                        <ol>
                            <li>Refresh the page</li>
                            <li>Clear your browser cache</li>
                            <li>Update to the latest version of the app</li>
                            <li>Restart your device</li>
                        </ol>
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

    .support-container {
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

    .support-title {
        font-size: 1.25rem;
        color: #333;
        font-weight: 600;
        margin-left: -15px;
    }

    .content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem 2rem;
        color: #64748b;
        line-height: 1.6;
    }

    .support-section {
        margin-bottom: 2rem;

        h2 {
            color: #334155;
            font-size: 1.3rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e2e8f0;
        }

        h3 {
            color: #334155;
            font-size: 1.1rem;
            margin: 1rem 0 0.5rem 0;
        }

        p {
            margin-bottom: 0.5rem;
        }

        ol {
            padding-left: 1.5rem;
            margin: 0.5rem 0;

            li {
                margin-bottom: 0.5rem;
            }
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
    }
`;

export default Support;