import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const DisclaimerDisclosure = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            <div className="disclaimer-container">
                <div className="top-bar">
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>
                    <h1 className="disclaimer-title">Disclaimer Disclosure</h1>
                </div>
                <div className="divider"></div>
                <div className="content">
                    <h2>1. No Investment Advice</h2>
                    <p>The content provided on this platform is for informational purposes only and should not be construed as financial, investment, or trading advice. We do not provide personalized recommendations.</p>
                    
                    <h2>2. Risk Disclosure</h2>
                    <p>Trading and investing involve substantial risk of loss and are not suitable for every investor. Past performance is not indicative of future results. You could lose more than your initial investment.</p>
                    
                    <h2>3. Accuracy of Information</h2>
                    <p>While we strive to provide accurate and timely information, we cannot guarantee that all content is complete, accurate, or current. Market conditions change rapidly, and information may become outdated.</p>
                    
                    <h2>4. Third-Party Content</h2>
                    <p>This platform may include content from third parties. We do not endorse or guarantee the accuracy of such content and are not responsible for any third-party materials.</p>
                    
                    <h2>5. No Warranty</h2>
                    <p>All content is provided "as is" without warranty of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
                    
                    <h2>6. Limitation of Liability</h2>
                    <p>Under no circumstances shall we be liable for any direct, indirect, incidental, special, or consequential damages that result from the use of or inability to use this platform.</p>
                    
                    <h2>7. Professional Advice</h2>
                    <p>We strongly advise you to consult with a licensed financial professional before making any investment decisions. Your personal financial situation should be evaluated before making any trades or investments.</p>
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

    .disclaimer-container {
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

    .disclaimer-title {
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

export default DisclaimerDisclosure;