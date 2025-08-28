import React from "react";
import styled from "styled-components";
import JobsListCom from "../components/AllJobsPage/JobsListCom";
import SearchAndFilter from "../components/AllJobsPage/SearchAndFilter";
import BottomNav from "../components/shared/BottomNav";
import Navbar from "../components/shared/Navbar";
import PaginationCom from "../components/AllJobsPage/PaginationCom";

const AllJobs = () => {
    return (
        <>
            <Wrapper>
                <SearchAndFilter />
                <JobsListCom />
                <PaginationCom />
            </Wrapper>
            <BottomNavWrapper>
                <BottomNav />
            </BottomNavWrapper>
        </>
    );
};

const Wrapper = styled.section`
    padding: 2rem 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 80px; /* Add space for bottom nav */
`;

const BottomNavWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
`;

export default AllJobs;