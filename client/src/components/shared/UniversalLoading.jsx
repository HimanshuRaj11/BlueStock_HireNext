import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styled from "styled-components";
import Logo from "../Logo"; // Adjust the import path as necessary

const UniversalLoading = ({ type, count = 1, width, height, circle = false }) => {
  // For full-page loading
  if (type === "page") {
    return (
      <PageLoadingWrapper>
        <LogoContainer>
          <Logo/> {/* Adjust size prop as needed */}
        </LogoContainer>
        <MadeInIndia>Made with 🩷 in India</MadeInIndia>
      </PageLoadingWrapper>
    );
  }

  // For content blocks
  if (type === "content") {
    return (
      <ContentLoadingWrapper>
        <Skeleton count={count} width={width} height={height} />
      </ContentLoadingWrapper>
    );
  }

  // For cards
  if (type === "card") {
    return (
      <CardLoadingWrapper>
        <Skeleton height={200} />
        <Skeleton count={2} />
      </CardLoadingWrapper>
    );
  }

  // Default loading (can be customized as needed)
  return (
    <DefaultLoadingWrapper>
      <Skeleton circle={circle} width={width} height={height} count={count} />
    </DefaultLoadingWrapper>
  );
};

// Styled components for different loading types
const PageLoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  align-items: center;
  gap: 2rem;
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MadeInIndia = styled.div`
  margin-bottom: 2rem;
  font-size: 1rem;
  color: #666;
  
  @media (max-width: 768px) {
    margin-bottom: 4rem;
    position: relative;
    top: -1rem;
  }
`;

const ContentLoadingWrapper = styled.div`
  width: 100%;
  padding: 1rem;
`;

const CardLoadingWrapper = styled.div`
  width: 100%;
  max-width: 300px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DefaultLoadingWrapper = styled.div`
  width: 100%;
`;

export default UniversalLoading;