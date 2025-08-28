import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Certificates = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="certificates-container">
                <div className="top-bar">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1 className="title">Certificates</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <div className="certificate-card">
                        <h3>Trading Fundamentals Certification</h3>
                        <p>Completed: June 2023</p>
                        <button className="view-button">View Certificate</button>
                    </div>
                    <div className="certificate-card">
                        <h3>Technical Analysis Mastery</h3>
                        <p>Completed: August 2023</p>
                        <button className="view-button">View Certificate</button>
                    </div>
                    <div className="certificate-card">
                        <h3>Risk Management Specialist</h3>
                        <p>Completed: October 2023</p>
                        <button className="view-button">View Certificate</button>
                    </div>
                    <div className="certificate-card">
                        <h3>Cryptocurrency Professional</h3>
                        <p>Completed: January 2024</p>
                        <button className="view-button">View Certificate</button>
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

    .certificates-container {
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

    .title {
        font-size: 1.25rem;
        color: #333;
        font-weight: 600;
        margin-left: -15px;
    }

    .content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem 2rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .certificate-card {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: transform 0.2s;

        &:hover {
            transform: translateY(-2px);
        }

        h3 {
            color: #334155;
            margin: 0 0 0.5rem 0;
        }

        p {
            color: #64748b;
            margin: 0 0 1rem 0;
        }
    }

    .view-button {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;

        &:hover {
            background: #2563eb;
        }
    }

    @media (max-width: 768px) {
        .top-bar {
            padding: 1rem 1.5rem;
            margin-left: -15px;
        }
        
        .content {
            padding: 1rem 1.5rem;
            grid-template-columns: 1fr;
        }
    }
`;

export default Certificates;