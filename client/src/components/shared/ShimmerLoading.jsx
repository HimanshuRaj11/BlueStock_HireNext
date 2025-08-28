import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styled from "styled-components";

const ShimmerLoading = ({ type = "default", count = 1, className = "" }) => {
  // Job cards grid layout
  if (type === "job-cards") {
    return (
      <JobCardsWrapper className={className}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div className="job-card-skeleton" key={index}>
              <Skeleton height={20} width="70%" />
              <Skeleton height={16} width="50%" />
              <Skeleton height={14} count={3} />
              <Skeleton height={30} width="40%" />
            </div>
          ))}
      </JobCardsWrapper>
    );
  }

  // Table rows
  if (type === "table-rows") {
    return (
      <TableWrapper className={className}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <tr key={index}>
              <td><Skeleton width={30} /></td>
              <td><Skeleton width="70%" /></td>
              <td><Skeleton width="60%" /></td>
              <td><Skeleton width="40%" /></td>
            </tr>
          ))}
      </TableWrapper>
    );
  }

  // Job detail page
  if (type === "job-detail") {
    return (
      <DetailWrapper className={className}>
        <div className="top-row">
          <Skeleton height={40} width="60%" />
          <Skeleton height={24} width="40%" style={{ marginTop: "1rem" }} />
          <Skeleton height={20} width="30%" style={{ marginTop: "0.5rem" }} />
        </div>
        
        <div className="middle-row">
          <Skeleton height={28} width="30%" style={{ marginBottom: "1rem" }} />
          <Skeleton count={5} style={{ marginBottom: "1rem" }} />
          
          <Skeleton height={28} width="30%" style={{ margin: "1.5rem 0 1rem" }} />
          <Skeleton height={20} width="80%" style={{ marginBottom: "0.5rem" }} />
          <Skeleton height={20} width="70%" style={{ marginBottom: "0.5rem" }} />
          
          <Skeleton height={28} width="30%" style={{ margin: "1.5rem 0 1rem" }} />
          <Skeleton height={20} width="80%" style={{ marginBottom: "0.5rem" }} />
          <Skeleton height={20} width="70%" style={{ marginBottom: "0.5rem" }} />
          
          <Skeleton height={28} width="30%" style={{ margin: "1.5rem 0 1rem" }} />
          <Skeleton height={20} width="50%" />
        </div>
      </DetailWrapper>
    );
  }

  if (type === "edit-job-form") {
    return (
        <EditJobFormWrapper className={className}>
        {/* Title row */}
        <div className="title-row-skeleton">
            <Skeleton width={150} height={24} />
        </div>
        
        {/* Form grid */}
        <div className="form-grid-skeleton">
            {/* First column */}
            <div className="form-column">
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} style={{ marginBottom: '16px' }} />
            
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} style={{ marginBottom: '16px' }} />
            
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} style={{ marginBottom: '16px' }} />
            </div>
            
            {/* Second column */}
            <div className="form-column">
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} style={{ marginBottom: '16px' }} />
            
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} style={{ marginBottom: '16px' }} />
            
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} style={{ marginBottom: '16px' }} />
            </div>
            
            {/* Third column */}
            <div className="form-column">
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} style={{ marginBottom: '16px' }} />
            
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} style={{ marginBottom: '16px' }} />
            
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={36} />
            </div>
        </div>
        
        {/* Skills and Facilities */}
        <div className="tags-row-skeleton">
            <div className="tags-column">
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={80} />
            </div>
            <div className="tags-column">
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={80} />
            </div>
        </div>
        
        {/* Description */}
        <div className="description-row-skeleton">
            <Skeleton height={20} width="30%" style={{ marginBottom: '4px' }} />
            <Skeleton height={120} style={{ marginBottom: '16px' }} />
        </div>
        
        {/* Submit button */}
        <div className="submit-row-skeleton">
            <Skeleton height={40} width={150} />
        </div>
        </EditJobFormWrapper>
    );
  }

  // Dashboard cards
  if (type === "dashboard-cards") {
    return (
      <DashboardCardsWrapper className={className}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div className="dashboard-card-skeleton" key={index}>
              <Skeleton height={36} width="40%" />
              <Skeleton height={48} width="80%" style={{ marginTop: "1rem" }} />
              <Skeleton height={24} width="60%" style={{ marginTop: "0.5rem" }} />
              <Skeleton 
                circle 
                height={100} 
                width={100} 
                style={{
                  position: "absolute",
                  right: "-20px",
                  bottom: "-20px",
                  opacity: 0.3
                }} 
              />
            </div>
          ))}
      </DashboardCardsWrapper>
    );
  }

  // Default simple skeleton
  return <Skeleton count={count} className={className} />;
};

const EditJobFormWrapper = styled.div`
  .title-row-skeleton {
    margin-bottom: 2rem;
  }

  .form-grid-skeleton {
    margin-top: 2rem;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .tags-row-skeleton {
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .tags-column {
    flex: 1;
    max-width: 500px;
  }

  .description-row-skeleton {
    margin-top: 1.5rem;
    width: 100%;
  }

  .submit-row-skeleton {
    margin-top: 1.5rem;
  }

  @media screen and (max-width: 1000px) {
    .form-grid-skeleton {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 600px) {
    .form-grid-skeleton {
      grid-template-columns: 1fr;
    }
    
    .tags-row-skeleton {
      flex-direction: column;
      gap: 1rem;
    }
    
    .tags-column {
      max-width: none;
    }
  }
`;

// Styled components for different layouts
const JobCardsWrapper = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-around;
  align-items: center;
  grid-gap: 1.5rem;
  flex-wrap: wrap;

  .job-card-skeleton {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1018px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr;
  }
`;

const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;

  tr {
    border-bottom: 1px solid #eee;
  }

  td {
    padding: 12px;
  }

  tr:nth-child(even) {
    background-color: #00000011;
  }
`;

const DetailWrapper = styled.div`
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
  margin-bottom: calc(20px + 1vw);
  width: 100%;
  box-sizing: border-box;

  .top-row {
    margin-bottom: calc(30px + 1vw);
    padding: 0 1rem;
    text-align: center;
  }

  .middle-row {
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

const DashboardCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(auto, 250px));
  gap: 20px;

  .dashboard-card-skeleton {
    position: relative;
    padding: 1.5rem;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #f8fafc;
  }

  @media screen and (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(auto, 300px));
  }
  @media screen and (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(auto, 300px));
  }
  @media screen and (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;

export default ShimmerLoading;