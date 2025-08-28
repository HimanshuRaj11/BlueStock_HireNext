import React, { useEffect, useState } from "react";
import styled from "styled-components";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
dayjs.extend(advancedFormat);
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { postHandler } from "../../utils/FetchHandlers";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VISIBILITY_STATUS } from "../../utils/JobData";

const JobCard = ({ job }) => {
    const date = dayjs(job?.job_deadline).format("MMM Do, YYYY");
    const { user } = useUserContext();
    const [showComment, setShowComment] = useState(false);

    const getStatusLabel = (status) => {
        switch(status) {
            case VISIBILITY_STATUS.UNDER_REVIEW: return "Under Review";
            case VISIBILITY_STATUS.ACCEPTED: return "Approved";
            case VISIBILITY_STATUS.HOLD: return "On Hold";
            case VISIBILITY_STATUS.REJECTED: return "Rejected";
            default: return "Unknown";
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case VISIBILITY_STATUS.UNDER_REVIEW: return "under-review";
            case VISIBILITY_STATUS.ACCEPTED: return "accepted";
            case VISIBILITY_STATUS.HOLD: return "hold";
            case VISIBILITY_STATUS.REJECTED: return "rejected";
            default: return "";
        }
    };

    const handleApply = async (id) => {
        let currentDate = new Date();
        let date = currentDate.toISOString().slice(0, 10);
        const appliedJob = {
            applicant_id: user?.id,
            recruiter_id: job?.created_by,
            job_id: id,
            status: "pending",
            dateOfApplication: date,
            resume: user?.resume || "",
        };
        try {
            const response = await postHandler({
                url: "http://localhost:3000/api/application/apply",
                body: appliedJob,
            });
            toast.success("Application submitted successfully!", {
                position: "top-right",
            });
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.error) {
                toast.error(error?.response?.data?.error[0].msg, {
                    position: "top-right",
                });
            } else {
                toast.error(error?.response?.data, {
                    position: "top-right",
                });
            }
        }
    };

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
            <div className="card-container">
                {/* Status Tag (visible to admin and recruiter) */}
                {(user?.role === 1 || user?.role === 2) && (
                    <div className={`status-tag ${getStatusClass(job.visibility_status)}`}>
                        {getStatusLabel(job.visibility_status)}
                        {job.admin_comment && (
                            <button 
                                className="comment-btn"
                                onClick={() => setShowComment(!showComment)}
                                title="View Admin Comment"
                            >
                                <ion-icon name="chatbox-outline"></ion-icon>
                            </button>
                        )}
                    </div>
                )}
                
                {/* Admin Comment Popup */}
                {showComment && job.admin_comment && (
                    <div className="comment-popup">
                        <p>{job.admin_comment}</p>
                        <button onClick={() => setShowComment(false)}>Close</button>
                    </div>
                )}

                <div className="card-header">
                    <div className="logo">
                        <span>{job.company.charAt(1)}</span>
                    </div>
                    <div className="right">
                        <h2 className="title">{job?.position}</h2>
                        <h4 className="company">- {job?.company}</h4>
                    </div>
                </div>
                <div className="middle-row">
                    <div className="location" title="Last Date">
                        <ion-icon name="calendar-outline"></ion-icon>
                        <span className="">{date}</span>
                    </div>
                    <div className="location">
                        <ion-icon name="location-outline"></ion-icon>
                        <span className="">{job?.job_location}</span>
                    </div>
                    <div className="type">
                        <ion-icon name="briefcase"></ion-icon>
                        <span className="capitalize">{job?.job_type}</span>
                    </div>
                    <div className="status capitalize">
                        <ion-icon name="timer"></ion-icon>
                        <span className={job?.job_status}>{job?.job_status}</span>
                    </div>
                </div>
                <div className="end-row">
                    <Link to={`/dashboard/job/${job.id}`} className="detail-btn">
                        details
                    </Link>
                    {user?.role === 3 && job.visibility_status === VISIBILITY_STATUS.ACCEPTED && (
                        <button
                            className="apply-btn"
                            onClick={() => handleApply(job.id)}
                        >
                            Apply
                        </button>
                    )}
                    {(user?.id === job?.created_by || user?.role === 1) && (
                        <Link
                            to={`/dashboard/edit-job/${job.id}`}
                            className="detail-btn"
                        >
                            edit
                        </Link>
                    )}
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    
    .card-container {
        height: 100%;
        box-shadow: 0 4px 4px var(--shadow-medium),
            0 -2px 6px var(--shadow-medium);
        border-radius: 4px;
        padding: 2rem 1.5rem;
        position: relative;
    }
    
    .status-tag {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        
        &.under-review {
            background-color: #fefe7d;
            color: #333;
        }
        &.accepted {
            background-color: #a0ffa3;
            color: #333;
        }
        &.hold {
            background-color: #ffb347;
            color: #333;
        }
        &.rejected {
            background-color: #feb69a;
            color: #333;
        }
    }
    
    .comment-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        display: flex;
        align-items: center;
    }
    
    .comment-popup {
        position: absolute;
        top: 40px;
        right: 10px;
        background: white;
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10;
        max-width: 250px;
        
        p {
            margin-bottom: 8px;
            font-size: 12px;
        }
        
        button {
            background: var(--color-accent);
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
    }
    .card-container .card-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .card-container .logo {
        margin-right: 18px;
        width: 50px;
        height: 50px;
        border-radius: 3px;
        background-color: #fb891f;
        display: flex;
        justify-content: center;
        align-items: center;
        /* optional */
        color: var(--color-white);
        font-size: 30px;
        font-weight: 700;
        text-transform: uppercase;
    }
    .right .title {
        text-transform: capitalize;
        font-size: calc(15px + 0.3vw);
        font-weight: 600;
        color: var(--color-black);
        line-height: 24px;
    }
    .right .company {
        display: inline-block;
        text-transform: capitalize;
        font-size: calc(11px + 0.15vw);
        font-weight: 600;
        color: var(--color-black);
        letter-spacing: 1px;
        padding: 1px 2px;
        border-radius: 4px;
    }
    @media screen and (max-width: 550px) {
        .right .title {
            line-height: 18px;
        }
    }

    .middle-row {
        margin-top: 20px;
        display: grid;
        grid-template-columns: 1fr;
        grid-row-gap: calc(0.6rem + 0.09vw);
        align-items: center;
    }

    .location,
    .type,
    .status {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
    }

    .status span {
        background-color: #fefe7d;
        padding: 2px 15px;
        border-radius: 6px;
        text-transform: uppercase;
        font-size: 12.5px;
        font-weight: 400;
        letter-spacing: 1px;
    }
    .status span.pending {
        background-color: #fefe7d;
    }
    .status span.declined {
        background-color: #feb69a;
    }
    .status span.interview {
        background-color: #a0ffa3;
    }
    .end-row {
        margin-top: calc(18px + 0.4vw);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .end-row .detail-btn {
        padding: 4px 18px;
        text-transform: capitalize;
        background-color: var(--color-black);
        color: var(--color-white);
        border-radius: 4px;
        letter-spacing: 1px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s linear;
        border: none;
    }
    .end-row .detail-btn:hover {
        background-color: var(--color-accent);
    }
    .end-row .apply-btn {
        padding: 4px 18px;
        text-transform: capitalize;
        background-color: var(--color-accent);
        color: var(--color-white);
        border-radius: 4px;
        letter-spacing: 1px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s linear;
        border: none;
        outline: none;
    }
    .end-row .apply-btn:hover {
        background-color: var(--color-black);
    }
`;
export default JobCard;
