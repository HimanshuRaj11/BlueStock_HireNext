import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const FAQs = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="container">
                <div className="top-bar">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>FAQs</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <div className="faq-item">
                        <h3>How do I reset my password?</h3>
                        <p>Go to Settings {'>'} Account {'>'} Password Reset. We'll send a link to your registered email.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Is there a mobile app available?</h3>
                        <p>Yes, our app is available on both iOS and Android platforms.</p>
                    </div>
                    <div className="faq-item">
                        <h3>What payment methods do you accept?</h3>
                        <p>We accept credit cards, PayPal, and bank transfers.</p>
                    </div>
                    <div className="faq-item">
                        <h3>How can I contact support?</h3>
                        <p>Support is available 24/7 via live chat or email at support@example.com.</p>
                    </div>
                    <div className="faq-item">
                        <h3>What's your refund policy?</h3>
                        <p>We offer 30-day money back guarantee on all purchases.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Are my transactions secure?</h3>
                        <p>All transactions are encrypted with 256-bit SSL security.</p>
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

    .faq-item {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        h3 {
            color: #334155;
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
        }

        p {
            color: #64748b;
            margin: 0;
            line-height: 1.6;
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

export default FAQs;