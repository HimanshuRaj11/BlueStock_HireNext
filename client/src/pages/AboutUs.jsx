import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="container">
                <div className="top-bar">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>About Us</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <section className="about-section">
                        <h2>Our Story</h2>
                        <p>Founded in 2020, we started as a small team of trading enthusiasts with a mission to democratize financial education. Today, we serve millions of users worldwide.</p>
                        
                        <h2>Our Mission</h2>
                        <p>To provide accessible, high-quality trading education that empowers individuals to make informed financial decisions.</p>
                        
                        <h2>The Team</h2>
                        <p>We're a diverse group of traders, educators, and technologists united by our passion for financial markets.</p>
                        
                        <h2>Our Values</h2>
                        <ul>
                            <li>Transparency in all our communications</li>
                            <li>Excellence in educational content</li>
                            <li>Innovation in learning approaches</li>
                            <li>Integrity in everything we do</li>
                        </ul>
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

    .about-section {
        max-width: 800px;
        margin: 0 auto;

        h2 {
            color: #334155;
            margin: 1.5rem 0 0.75rem;
            font-size: 1.25rem;
        }

        p {
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 1rem;
        }

        ul {
            color: #64748b;
            padding-left: 1.25rem;
            margin-bottom: 1.5rem;

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

export default AboutUs;