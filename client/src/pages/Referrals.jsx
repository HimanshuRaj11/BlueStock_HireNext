import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Referrals = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="referrals-container">
                <div className="top-bar">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className="referrals-title">Referrals</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <div className="referral-section">
                        <h2>Your Referral Code</h2>
                        <div className="referral-code">
                            <code>FRIEND2023</code>
                            <button className="copy-btn">Copy</button>
                        </div>
                    </div>
                    
                    <div className="referral-section">
                        <h2>Share Your Link</h2>
                        <div className="share-options">
                            <button className="share-btn whatsapp">WhatsApp</button>
                            <button className="share-btn telegram">Telegram</button>
                            <button className="share-btn email">Email</button>
                        </div>
                    </div>
                    
                    <div className="referral-section">
                        <h2>Referral Stats</h2>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <h3>Total Referrals</h3>
                                <p>12</p>
                            </div>
                            <div className="stat-item">
                                <h3>Active Referrals</h3>
                                <p>8</p>
                            </div>
                            <div className="stat-item">
                                <h3>Earned Rewards</h3>
                                <p>$120</p>
                            </div>
                        </div>
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

    .referrals-container {
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

    .referrals-title {
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
    }

    .referral-section {
        margin-bottom: 2rem;

        h2 {
            color: #334155;
            font-size: 1.3rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e2e8f0;
        }
    }

    .referral-code {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;

        code {
            background: #f3f4f6;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 1.1rem;
            color: #1e40af;
            font-weight: 500;
        }

        .copy-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                background: #2563eb;
            }
        }
    }

    .share-options {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;

        .share-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;

            &.whatsapp {
                background: #25D366;
                color: white;

                &:hover {
                    background: #128C7E;
                }
            }

            &.telegram {
                background: #0088cc;
                color: white;

                &:hover {
                    background: #006699;
                }
            }

            &.email {
                background: #ea4335;
                color: white;

                &:hover {
                    background: #d33426;
                }
            }
        }
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;

        .stat-item {
            background: #f9fafb;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;

            h3 {
                color: #64748b;
                font-size: 1rem;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            p {
                color: #1e40af;
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
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

        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
`;

export default Referrals;