import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="privacy-policy-container">
                <div className="top-bar">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className="privacy-policy-title">Privacy Policy</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <section>
                        <h2>1. Information We Collect</h2>
                        <p>We collect information you provide directly, including name, email, and contact details when you register or use our services.</p>
                    </section>
                    
                    <section>
                        <h2>2. How We Use Information</h2>
                        <p>We use your information to provide and improve our services, communicate with you, and ensure security.</p>
                    </section>
                    
                    <section>
                        <h2>3. Information Sharing</h2>
                        <p>We do not sell your personal data. Information may be shared with service providers under strict confidentiality agreements.</p>
                    </section>
                    
                    <section>
                        <h2>4. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your information from unauthorized access.</p>
                    </section>
                    
                    <section>
                        <h2>5. Your Rights</h2>
                        <p>You may access, correct, or delete your personal information through your account settings.</p>
                    </section>
                    
                    <section>
                        <h2>6. Changes to This Policy</h2>
                        <p>We may update this policy periodically. Continued use of our services constitutes acceptance.</p>
                    </section>
                    
                    <section>
                        <h2>7. Contact Us</h2>
                        <p>For privacy-related inquiries, contact our Data Protection Officer at privacy@example.com.</p>
                    </section>
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

    .privacy-policy-container {
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

    .privacy-policy-title {
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

        section {
            margin-bottom: 2rem;

            h2 {
                color: #334155;
                font-size: 1.2rem;
                margin-bottom: 0.75rem;
            }

            p {
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
            
            section {
                margin-bottom: 1.5rem;
            }
        }
    }
`;

export default PrivacyPolicy;