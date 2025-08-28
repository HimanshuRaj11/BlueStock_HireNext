import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Courses = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="courses-container">
                <div className="top-bar">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className="courses-title">Courses</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <div className="course-card">
                        <h2>Beginner Trading Course</h2>
                        <p>Learn the fundamentals of trading, including market terminology, basic strategies, and risk management techniques.</p>
                        <button className="enroll-button">Enroll Now</button>
                    </div>
                    
                    <div className="course-card">
                        <h2>Technical Analysis Masterclass</h2>
                        <p>Master chart patterns, indicators, and technical tools to analyze market trends and make informed trading decisions.</p>
                        <button className="enroll-button">Enroll Now</button>
                    </div>
                    
                    <div className="course-card">
                        <h2>Options Trading Strategies</h2>
                        <p>Explore advanced options strategies including spreads, straddles, and iron condors for different market conditions.</p>
                        <button className="enroll-button">Enroll Now</button>
                    </div>
                    
                    <div className="course-card">
                        <h2>Cryptocurrency Fundamentals</h2>
                        <p>Understand blockchain technology, crypto markets, and how to analyze and trade digital assets effectively.</p>
                        <button className="enroll-button">Enroll Now</button>
                    </div>
                    
                    <div className="course-card">
                        <h2>Risk Management Workshop</h2>
                        <p>Learn position sizing, stop-loss techniques, and portfolio management to protect your capital.</p>
                        <button className="enroll-button">Enroll Now</button>
                    </div>
                    
                    <div className="course-card">
                        <h2>Algorithmic Trading Introduction</h2>
                        <p>Discover how to develop, backtest, and implement automated trading strategies.</p>
                        <button className="enroll-button">Enroll Now</button>
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

    .courses-container {
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

    .courses-title {
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
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .course-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        h2 {
            color: #334155;
            margin-top: 0;
            margin-bottom: 0.75rem;
            font-size: 1.2rem;
        }

        p {
            margin-bottom: 1.25rem;
            color: #64748b;
        }
    }

    .enroll-button {
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

export default Courses;