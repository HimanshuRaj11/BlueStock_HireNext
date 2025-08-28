import axios from "axios";
import React from "react";
import styled from "styled-components";
import LoadingComTwo from "../shared/LoadingComTwo";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { updateHandler } from "../../utils/FetchHandlers";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import ShimmerLoading from "../shared/ShimmerLoading";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
const queryClient = new QueryClient();

const Recruiter = () => {
    const [selectedApplicant, setSelectedApplicant] = React.useState(null);
    const [showProfileModal, setShowProfileModal] = React.useState(false);
    const PREFERENCE_MAPPING = {
        1: "Job Only",
        2: "Internship Only", 
        3: "Both Job and Internship"
    };
    const {
        isPending,
        isError,
        data: jobs,
        error,
        refetch,
    } = useQuery({
        queryKey: ["rec-jobs"],
        queryFn: async () => {
            const response = await axios.get(
                `http://localhost:3000/api/application/recruiter-jobs`,
                {
                    withCredentials: true,
                }
            );
            return response?.data?.result || [];
        },
    });

    const { data: applicantData } = useQuery({
        queryKey: ['applicant', selectedApplicant],
        queryFn: async () => {
            if (!selectedApplicant) return null;
            const response = await axios.get(
                `http://localhost:3000/api/users/${selectedApplicant}`,
                { withCredentials: true }
            );
            return response.data.result;
        },
        enabled: !!selectedApplicant
    });

    const { data: educationData, isLoading: isLoadingEducation } = useQuery({
        queryKey: ['education', selectedApplicant],
        queryFn: async () => {
            if (!selectedApplicant) return null;
            const response = await axios.get(
                `http://localhost:3000/api/education/user/${selectedApplicant}`,
                { withCredentials: true }
            );
            return response.data.result;
        },
        enabled: !!selectedApplicant
    });

    const updateJobStatusMutation = useMutation({
        mutationFn: ({ id, recruiter_id, status }) => 
            updateHandler({
                body: { status },
                url: `http://localhost:3000/api/application/${id}`
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["rec-jobs"]);
            refetch();
            Swal.fire({
                icon: "success",
                title: "Status Updated",
                text: data?.message,
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response?.data,
            });
        }
    });

    const handleAcceptStatus = (application_id, recruiter_id) => {
        updateJobStatusMutation.mutate({ 
            id: application_id.toString(),  
            status: "accepted" 
        });
    };

    const handleRejectStatus = (application_id, recruiter_id) => {
        updateJobStatusMutation.mutate({ 
            id: application_id.toString(),  
            status: "rejected" 
        });
    };

    const handleResumeView = (drive) => {
        const newWindow = window.open(drive, "_blank");
        if (newWindow) {
            newWindow.focus();
        } else {
            alert("Please allow pop-ups for this site to open the PDF.");
        }
    };
    if (isPending) {
        return <ShimmerLoading type="table-rows" count={5} />;
    }

    if (isError) {
        return (
            <h2 className="mt-8 text-2xl font-semibold text-center text-red-600">
                -- {error?.response?.data} --
            </h2>
        );
    }

    if (jobs) {
        // console.log(jobs);
    }

    if (!jobs || jobs.length === 0) {  // Changed from !jobs?.length === 0
        return <h2 className="">No Application found</h2>;
    }

    return (
        <Wrapper>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="scroll-container">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Job Position</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Profile</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs?.map((job, index) => {
                                let i = index + 1 < 10 ? `0${index + 1}` : index + 1;
                                return (
                                    <tr key={job?.application_id}>
                                        <td>{i}</td>
                                        <td>{job?.position}</td>
                                        <td>{job?.company}</td>
                                        <td>{job?.status}</td>
                                        <td>
                                            <button
                                                className="action view-profile"
                                                onClick={() => {
                                                    setSelectedApplicant(job.applicant_id);
                                                    setShowProfileModal(true);
                                                }}
                                            >
                                                <ion-icon name="eye"></ion-icon>
                                            </button>
                                        </td>
                                        <td className="action-row">
                                            <button
                                                className="action resume"
                                                onClick={() => handleResumeView(job.resume)}
                                            >
                                                resume
                                            </button>

                                            {job?.status === "pending" && (
                                                <>
                                                    <button
                                                        className="action accept"
                                                        onClick={() =>
                                                            handleAcceptStatus(
                                                                job.application_id,
                                                                job?.recruiter_id
                                                            )
                                                        }
                                                    >
                                                        accept
                                                    </button>
                                                    <button
                                                        className="action reject"
                                                        onClick={() =>
                                                            handleRejectStatus(
                                                                job.application_id,
                                                                job?.recruiter_id
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {job?.status === "accepted" && (
                                                <button
                                                    className="action reject"
                                                    onClick={() =>
                                                        handleRejectStatus(
                                                            job.application_id,
                                                            job?.recruiter_id
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            )}

                                            {job?.status === "rejected" && (
                                                <button
                                                    className="action accept"
                                                    onClick={() =>
                                                        handleAcceptStatus(
                                                            job.application_id,
                                                            job?.recruiter_id
                                                        )
                                                    }
                                                >
                                                    accept
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="profile-modal">
                    <div className="modal-content">
                        <button 
                            className="close-button"
                            onClick={() => {
                                setShowProfileModal(false);
                                setSelectedApplicant(null);
                            }}
                        >
                            &times;
                        </button>
                        
                        <h3>Applicant Profile</h3>
                        
                        {applicantData ? (
                            <div className="personal-info">
                                <p><strong>Name:</strong> {applicantData.full_name || 'Not specified'}</p>
                                <p><strong>Date of Birth:</strong> {dayjs(applicantData.dob).format("MMM Do, YYYY") || 'Not specified'}</p>
                                <p><strong>Preferences:</strong> {applicantData.preference ? PREFERENCE_MAPPING[applicantData.preference] : 'Not specified'}</p>
                            </div>
                        ) : (
                            <p>Loading personal information...</p>
                        )}

                        <h4>Education Details</h4>
                        
                        {educationData ? (
                            educationData.length > 0 ? (
                                <div className="education-list">
                                    {educationData.map((edu, index) => (
                                        <div key={index} className="education-item">
                                            <p><strong>Course:</strong> {edu.course_name}</p>
                                            <p><strong>Specialization:</strong> {edu.specialization || 'N/A'}</p>
                                            <p><strong>College:</strong> {edu.college_name}</p>
                                            <p><strong>Score:</strong> {edu.percentage_cgpa}</p>
                                            <p><strong>Duration:</strong> {edu.start_year} - {edu.end_year}</p>
                                            {index < educationData.length - 1 && <hr />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No education details available</p>
                            )
                        ) : (
                            <p>Loading education details...</p>
                        )}
                    </div>
                </div>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.section`
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden; /* Prevent horizontal scroll on entire page */

    /* Title Row Styles */
    .title-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: calc(0.9rem + 0.4vw);
        text-transform: capitalize;
        letter-spacing: 1px;
        font-weight: 600;
        opacity: 0.85;
        color: var(--color-black);
        position: relative;
        margin-bottom: 20px;
    }

    /* New scroll container */
    .scroll-container {
        width: 100%;
        overflow: hidden; /* Hide the actual scrollbar */
    }

    /* Table Container */
    .table-container {
        width: 100%;
        margin-top: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow-x: auto; /* Enable horizontal scroll only for table */
        -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    }

    /* Table Styles */
    .table {
        width: 100%;
        min-width: 700px; /* Force table to be wider than container on mobile */
        border-collapse: collapse;
        border-spacing: 0;
        border: 1px solid #ddd;
    }

    .table thead {
        background-color: var(--color-accent);
        color: var(--color-white);
        font-size: 14px;
        letter-spacing: 1px;
        font-weight: 400;
        text-transform: capitalize;
    }

    .table th,
    .table td {
        text-align: left;
        padding: 12px;
        white-space: nowrap;
    }

    .table tbody tr {
        font-size: 15px;
        font-weight: 400;
        text-transform: capitalize;
        letter-spacing: 1px;
        transition: all 0.2s linear;
    }

    .table tbody tr:nth-child(even) {
        background-color: #00000011;
    }

    /* Action Buttons */
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        column-gap: 12px;
        flex-wrap: wrap;
        row-gap: 8px;
    }

    .action {
        font-size: 12px;
        text-transform: capitalize;
        font-weight: 500;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        white-space: nowrap;
    }

    .action.view-profile {
        background: none;
        border: none;
        color: #4a6baf;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0 5px;
    }

    .action.accept {
        background-color: #168e24;
    }

    .action.reject {
        background-color: #f1322f;
    }

    .action.resume {
        background-color: #ef9712;
    }

    /* Profile Modal Styles */
    .profile-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 1rem;
    }

    .modal-content {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        width: 95%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .personal-info {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
    }

    .personal-info p {
        margin: 0.5rem 0;
    }

    .education-list {
        margin-top: 1rem;
    }

    .education-item {
        margin-bottom: 1rem;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 4px;
    }

    .education-item p {
        margin: 0.5rem 0;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
        padding: 12px;
        
        .table-container {
            -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        }

        .table {
            min-width: 700px; /* Ensure table is scrollable */
        }

        .table th,
        .table td {
            padding: 8px 10px;
        }
        
        .table .action-row {
            column-gap: 6px;
        }
        
        .table .action-row .action {
            font-size: 12px;
            padding: 3px 6px;
        }

        .modal-content {
            padding: 1rem;
        }
    }

    /* Desktop-specific optimizations */
    @media (min-width: 769px) {
        .table-container {
            overflow: visible;
        }
        
        .table {
            width: 100%;
            min-width: auto; /* Reset min-width for desktop */
        }
    }
`;
export default Recruiter;
