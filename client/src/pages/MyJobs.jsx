import React from "react";
import styled from "styled-components";

import { useUserContext } from "../context/UserContext";
import Applicant from "../components/MyJobsPage/Applicant";
import Recruiter from "../components/MyJobsPage/Recruiter";

const MyJobs = () => {
    const { user } = useUserContext();

    return (
        <Wrapper>
            <div className="title-container">
                <h2 className="title">
                    {user?.role === 2 && "Manage Applications"}
                    {user?.role === 3 && "My Applications"}
                </h2>
            </div>
            {user?.role === 3 && <Applicant />}
            {user?.role === 2 && <Recruiter />}
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .title-container {
        padding: 0 1rem; /* Add horizontal padding */
        margin-bottom: 1.5rem; /* Add space below the title */
    }

    .title {
        font-size: calc(1.6rem + 0.4vw);
        text-transform: capitalize;
        letter-spacing: 1px;
        font-weight: 600;
        opacity: 0.85;
        color: var(--color-black);
        margin-top: 10px;
        margin-bottom: -15px;
    }
`;

export default MyJobs;