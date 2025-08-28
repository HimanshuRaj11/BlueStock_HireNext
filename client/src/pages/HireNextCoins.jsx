import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HireNextCoins = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="hire-next-coins-container">
                <div className="top-bar">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className="hire-next-coins-title">HireNext Coins</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <div className="balance-card">
                        <h3>Your Coin Balance</h3>
                        <div className="balance-amount">
                            <span className="amount">1,250</span>
                            <span className="coin-icon">🪙</span>
                        </div>
                    </div>

                    <div className="action-section">
                        <h3>Earn More Coins</h3>
                        <div className="action-grid">
                            <div className="action-card">
                                <div className="action-icon">💼</div>
                                <h4>Complete Profile</h4>
                                <p>+100 coins</p>
                                <button className="action-button">Claim</button>
                            </div>
                            <div className="action-card">
                                <div className="action-icon">👥</div>
                                <h4>Refer Friends</h4>
                                <p>+50 per referral</p>
                                <button className="action-button">Invite</button>
                            </div>
                            <div className="action-card">
                                <div className="action-icon">📅</div>
                                <h4>Daily Check-in</h4>
                                <p>+10 coins/day</p>
                                <button className="action-button">Check In</button>
                            </div>
                        </div>
                    </div>

                    <div className="transaction-history">
                        <h3>Recent Transactions</h3>
                        <div className="transaction-list">
                            <div className="transaction-item">
                                <div className="transaction-details">
                                    <span className="transaction-type">Profile Completion</span>
                                    <span className="transaction-date">Today</span>
                                </div>
                                <span className="transaction-amount positive">+100 🪙</span>
                            </div>
                            <div className="transaction-item">
                                <div className="transaction-details">
                                    <span className="transaction-type">Job Application</span>
                                    <span className="transaction-date">Yesterday</span>
                                </div>
                                <span className="transaction-amount negative">-50 🪙</span>
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

    .hire-next-coins-container {
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

    .hire-next-coins-title {
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

    .balance-card {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;

        h3 {
            color: #64748b;
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }

        .balance-amount {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;

            .amount {
                font-size: 2.5rem;
                font-weight: 700;
                color: #334155;
            }

            .coin-icon {
                font-size: 2rem;
            }
        }
    }

    .action-section {
        margin-bottom: 2rem;

        h3 {
            color: #334155;
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;

            .action-card {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 1.5rem;
                text-align: center;
                transition: transform 0.2s;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .action-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                h4 {
                    color: #334155;
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                }

                p {
                    color: #64748b;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                }

                .action-button {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    width: 100%;
                    transition: background 0.2s;

                    &:hover {
                        background: #2563eb;
                    }
                }
            }
        }
    }

    .transaction-history {
        h3 {
            color: #334155;
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        .transaction-list {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;

            .transaction-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #e2e8f0;

                &:last-child {
                    border-bottom: none;
                }

                .transaction-details {
                    display: flex;
                    flex-direction: column;

                    .transaction-type {
                        color: #334155;
                        font-weight: 500;
                    }

                    .transaction-date {
                        color: #64748b;
                        font-size: 0.8rem;
                    }
                }

                .transaction-amount {
                    font-weight: 600;

                    &.positive {
                        color: #10b981;
                    }

                    &.negative {
                        color: #ef4444;
                    }
                }
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

        .action-grid {
            grid-template-columns: 1fr;
        }
    }
`;

export default HireNextCoins;