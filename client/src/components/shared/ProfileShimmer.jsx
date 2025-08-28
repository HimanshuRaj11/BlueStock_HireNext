import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styled from "styled-components";

const ProfileShimmer = ({ isMobile }) => {
  return (
    <ShimmerWrapper>
      {/* Profile Header Shimmer */}
      <div className="wrapper">
        <div className="profile-header-shimmer">
          <div className="avatar-shimmer">
            <Skeleton circle height={96} width={96} />
            <Skeleton width={80} height={20} style={{ marginTop: "10px" }} />
          </div>
          <div className="profile-info-shimmer">
            <Skeleton width={200} height={30} />
            <Skeleton width={150} height={20} style={{ marginTop: "8px" }} />
            <Skeleton width={180} height={16} style={{ marginTop: "8px" }} />
          </div>
        </div>
      </div>

      {/* Tabs Shimmer */}
      <div className="wrapper">
        <div className="tabs-shimmer">
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} style={{ marginLeft: "15px" }} />
        </div>
      </div>

      {/* Basic Information Shimmer */}
      <div className="wrapper">
        <Skeleton width={150} height={25} style={{ marginBottom: "20px" }} />
        <div className="info-cards-shimmer">
          <div className="info-card-shimmer">
            <Skeleton width={120} height={20} style={{ marginBottom: "15px" }} />
            <div className="info-grid-shimmer">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="info-item-shimmer">
                  <Skeleton width={80} height={16} />
                  <Skeleton width={150} height={16} />
                </div>
              ))}
            </div>
          </div>
          <div className="info-card-shimmer">
            <Skeleton width={120} height={20} style={{ marginBottom: "15px" }} />
            <div className="info-grid-shimmer">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="info-item-shimmer">
                  <Skeleton width={80} height={16} />
                  <Skeleton width={150} height={16} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Shimmer */}
      <div className="wrapper">
        <Skeleton width={150} height={25} style={{ marginBottom: "20px" }} />
        <div className="profile-details-shimmer">
          <Skeleton count={3} style={{ marginBottom: "15px" }} />
          <div className="detail-grid-shimmer">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="detail-item-shimmer">
                <Skeleton width={100} height={16} />
                <Skeleton width={150} height={16} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Shimmer */}
      <div className="wrapper">
        <Skeleton width={150} height={25} style={{ marginBottom: "20px" }} />
        <div className="skills-shimmer">
          {[...Array(8)].map((_, i) => (
            <Skeleton
              key={i}
              width={80}
              height={30}
              style={{ borderRadius: "20px", marginRight: "10px", marginBottom: "10px" }}
            />
          ))}
        </div>
      </div>

      {/* Education Shimmer */}
      <div className="wrapper">
        <Skeleton width={150} height={25} style={{ marginBottom: "20px" }} />
        <div className="education-shimmer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="education-item-shimmer">
              <div className="edu-header-shimmer">
                <Skeleton width={180} height={20} />
                <Skeleton width={100} height={16} />
              </div>
              <div className="edu-details-shimmer">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="edu-detail-shimmer">
                    <Skeleton width={80} height={16} />
                    <Skeleton width={120} height={16} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Shimmer */}
      <div className="wrapper">
        <Skeleton width={150} height={25} style={{ marginBottom: "20px" }} />
        <div className="experience-shimmer">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="experience-item-shimmer">
              <div className="exp-header-shimmer">
                <Skeleton width={180} height={20} />
                <Skeleton width={120} height={16} style={{ marginTop: "5px" }} />
              </div>
              <div className="exp-details-shimmer">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="exp-detail-shimmer">
                    <Skeleton width={80} height={16} />
                    <Skeleton width={120} height={16} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Shimmer */}
      <div className="wrapper">
        <Skeleton width={150} height={25} style={{ marginBottom: "20px" }} />
        <div className="social-links-shimmer">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="social-link-item-shimmer">
              <Skeleton circle width={24} height={24} />
              <Skeleton width={100} height={20} />
            </div>
          ))}
        </div>
      </div>
    </ShimmerWrapper>
  );
};

const ShimmerWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .wrapper {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 6px 12px rgba(30, 10, 58, 0.04);
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }

  .profile-header-shimmer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  .avatar-shimmer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .profile-info-shimmer {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 768px) {
      align-items: flex-start;
      padding-top: 1rem;
    }
  }

  .tabs-shimmer {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .info-cards-shimmer {
    display: grid;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .info-card-shimmer {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 1.2rem;
  }

  .info-grid-shimmer {
    display: grid;
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .info-item-shimmer {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row;
    }
  }

  .profile-details-shimmer {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .detail-grid-shimmer {
    display: grid;
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .detail-item-shimmer {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .skills-shimmer {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .education-shimmer,
  .experience-shimmer {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .education-item-shimmer,
  .experience-item-shimmer {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 1rem;
  }

  .edu-header-shimmer,
  .exp-header-shimmer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .edu-details-shimmer,
  .exp-details-shimmer {
    display: grid;
    gap: 0.8rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .edu-detail-shimmer,
  .exp-detail-shimmer {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .social-links-shimmer {
    display: grid;
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .social-link-item-shimmer {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.6rem 0.8rem;
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    gap: 2rem;

    .wrapper {
      padding: 2rem;
    }
  }
`;


export default ProfileShimmer;