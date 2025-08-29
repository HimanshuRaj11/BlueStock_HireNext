import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getAllHandler } from "../utils/FetchHandlers";
import { useUserContext } from "./UserContext";

const jobContext = React.createContext();

const JobContext = ({ children }) => {
    const [jobLoading, setJobLoading] = useState(true);
    const [jobError, setJobError] = useState({ status: false, message: "" });
    const [jobs, setJobs] = useState({});
    const { user } = useUserContext();

    const handleJobFetch = async (url) => {
        setJobLoading(true);
        try {
            // Add user role to query params for proper filtering
            const modifiedUrl = user?.role
                ? `${url}&role=${user.role}&userId=${user.id}`
                : url;

            const response = await axios.get(modifiedUrl, { withCredentials: true });
            setJobError({ status: false, message: "" });
            setJobs(response?.data);
        } catch (error) {
            setJobError({ status: true, message: error?.message });
            setJobs({ status: false });
            setJobLoading(false);
        }
        setJobLoading(false);
    };

    const updateJobStatus = async (jobId, status, comment) => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/api/jobs/${jobId}/status`,
                { visibility_status: status, admin_comment: comment },
                { withCredentials: true }
            );

            // Update local state if successful
            if (jobs?.result) {
                setJobs(prev => ({
                    ...prev,
                    result: prev.result.map(job =>
                        job.id === jobId
                            ? { ...job, visibility_status: status, admin_comment: comment }
                            : job
                    )
                }));
            }

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data || error.message };
        }
    };

    useEffect(() => {
        handleJobFetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/jobs?page=1`
        );
    }, [user?.role, user?.id]);

    const passing = {
        jobLoading,
        jobError,
        jobs,
        setJobs,
        handleJobFetch,
        updateJobStatus,
    };

    return (
        <jobContext.Provider value={passing}>{children}</jobContext.Provider>
    );
};

const useJobContext = () => useContext(jobContext);

export { useJobContext, JobContext };