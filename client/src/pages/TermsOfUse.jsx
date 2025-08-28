import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const TermsOfUse = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="terms-container">
                <div className="top-bar">
                    <button 
                        className="back-button"
                        onClick={() => navigate('/')}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className="terms-title">Terms of Use</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <h2>1. Introduction</h2>
                    <p>Welcome to our application. These terms govern your use of our service.</p>
                    
                    <h2>2. Acceptance of Terms</h2>
                    <p>By accessing or using our application, you agree to be bound by these terms.</p>
                    
                    <h2>3. User Responsibilities</h2>
                    <p>You are responsible for maintaining the confidentiality of your account information.</p>
                    
                    <h2>4. Intellectual Property</h2>
                    <p>All content and materials available on our application are protected by intellectual property laws.</p>
                    
                    <h2>5. Limitation of Liability</h2>
                    <p>We shall not be liable for any indirect, incidental, or consequential damages.</p>
                    
                    <h2>6. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance.</p>
                    
                    <h2>7. Governing Law</h2>
                    <p>These terms shall be governed by the laws of your jurisdiction.</p>
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

    .terms-container {
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

    .terms-title {
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

        h2 {
            color: #334155;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
        }

        p {
            margin-bottom: 1rem;
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

export default TermsOfUse;