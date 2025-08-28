import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import avatar from "../assets/media/avatar.jpg";
import { useUserContext } from "../context/UserContext";
import Loading from "../components/shared/Loading";
import UniversalLoading from "../components/shared/UniversalLoading";
import ProfileShimmer from "../components/shared/ProfileShimmer";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { fetchSkillsByIds } from "../utils/skillsHelper";
import calculateProfileCompletion from "../utils/profileCompletion";
import {
    FiLinkedin,
    FiGithub,
    FiTwitter,
    FiGlobe,
    FiCode,
    FiLink
} from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

const ProfileHeader = ({ userData, isMobile, activeTab, setActiveTab }) => {
    const [lastUpdated, setLastUpdated] = useState("");
    const { user } = useUserContext();
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [profileData, setProfileData] = useState({
        education: [],
        certificates: [],
        projects: [],
        skills: [],
        about: "",
        social_links: {},
        full_address: "",
        workExperiences: [],
        userProfile: null,
        recruiterProfile: null
    });

    const getProgressColor = (value) => {
        if (value <= 10) return '#f44336';
        if (value <= 60) return '#ff9800';
        return '#4caf50';
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                if (!user) return;

                let promises = [];
                promises.push(
                    axios.get("http://localhost:3000/api/user-profile/skills",
                        { withCredentials: true })
                        .then(res => {
                            return { skills: res.data.skills || res.data || [] };
                        })
                        .catch(() => {
                            return { skills: [] };
                        })
                );

                if (user.role === 3) {
                    promises = promises.concat([
                        axios.get("http://localhost:3000/api/user-profile",
                            { withCredentials: true })
                            .then(res => {
                                return {
                                    userProfile: res.data,
                                    about: res.data.about || "",
                                    full_address: res.data.full_address || "",
                                    social_links: res.data.social_links || {}
                                };
                            })
                            .catch(() => {
                                return {};
                            }),
                        axios.get("http://localhost:3000/api/education",
                            { withCredentials: true })
                            .then(res => {
                                return { education: res.data.result || res.data || [] };
                            })
                            .catch(() => {
                                return { education: [] };
                            }),
                        axios.get("http://localhost:3000/api/work-experience",
                            { withCredentials: true })
                            .then(res => {
                                return { workExperiences: res.data.result || res.data || [] };
                            })
                            .catch(() => {
                                return { workExperiences: [] };
                            }),
                        axios.get("http://localhost:3000/api/certificates",
                            { withCredentials: true })
                            .then(res => {
                                return { certificates: res.data.result || res.data || [] };
                            })
                            .catch(() => {
                                return { certificates: [] };
                            }),
                        axios.get("http://localhost:3000/api/projects",
                            { withCredentials: true })
                            .then(res => {
                                return { projects: res.data.result || res.data || [] };
                            })
                            .catch(() => {
                                return { projects: [] };
                            })
                    ]);
                } else if (user.role === 2) {
                    promises.push(
                        axios.get("http://localhost:3000/api/recruiter-profile",
                            { withCredentials: true })
                            .then(res => {
                                return { recruiterProfile: res.data };
                            })
                            .catch(() => {
                                return {};
                            })
                    );
                }

                const results = await Promise.all(promises);
                const mergedData = results.reduce((acc, curr) => {
                    const normalized = {};
                    Object.keys(curr).forEach(key => {
                        normalized[key] = curr[key]?.result || curr[key];
                    });
                    return { ...acc, ...normalized };
                }, {});

                setProfileData(prev => ({ ...prev, ...mergedData }));

            } catch (error) {
                console.error("Error in fetchAllData:", error);
            }
        };

        fetchAllData();
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const completion = calculateProfileCompletion(user, profileData);
        setProfileCompletion(completion);

        if (user?.updated_at) {
            setLastUpdated(dayjs(user.updated_at).fromNow());
        }
    }, [user, profileData]);

    const progressColor = getProgressColor(profileCompletion);

    useEffect(() => {
        if (userData?.updated_at) {
            setLastUpdated(dayjs(userData.updated_at).fromNow());
        }
    }, [userData]);

    return (
        <HeaderWrapper progressColor={progressColor} profileCompletion={profileCompletion}>
            <div className="profile-header">
                <div className="avatar-container">
                    <div className="circle-container">
                        <div className="circle">
                            <div className="inner-circle">
                                {userData?.profile_photo ? (
                                    <img
                                        src={userData.profile_photo}
                                        alt="Profile"
                                        className="profile-img"
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <div style={{ fontSize: "20px", fontWeight: "bold" }}>+</div>
                                        <div>Add photo</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="percentage-label">{profileCompletion}%</div>
                    </div>

                    <Link
                        to={`/dashboard/edit-profile/${userData?.id}`}
                        className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-md font-medium transition text-sm"
                    >
                        <span>Edit Profile</span>
                    </Link>
                </div>

                <div className="profile-info">
                    <h2>{userData?.full_name || "Your Profile"}</h2>
                    {userData?.heading && <h3>{userData.heading}</h3>}
                    <p className="last-updated">
                        Profile last updated: {lastUpdated || "Recently"}
                    </p>
                </div>
            </div>

            {isMobile && (
                <div className="mobile-tabs">
                    <button
                        className={`tab ${activeTab === "details" ? "active" : ""}`}
                        onClick={() => setActiveTab("details")}
                    >
                        View Details
                    </button>
                    <button
                        className={`tab ${activeTab === "activity" ? "active" : ""}`}
                        onClick={() => setActiveTab("activity")}
                    >
                        Activity & Insights
                    </button>
                </div>
            )}
        </HeaderWrapper>
    );
};

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("details");
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [skills, setSkills] = useState([]);
    const date = dayjs(user?.created_at).format("MMM Do, YYYY");
    const dob = dayjs(user?.dob).format("MMM Do, YYYY");

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (userData && !userData.is_mo_verified) {
            toast.warn(
                <div>
                    Mobile number not verified. Click{' '}
                    <span
                        style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => navigate(`/dashboard/edit-profile/${userData.id}`)}
                    >
                        here
                    </span>{' '}
                    to verify.
                </div>,
                {
                    autoClose: 5000,
                    closeOnClick: false,
                }
            );
        }
    }, [userData, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/auth/me", { withCredentials: true });
                setUserData(response.data.result);
                if (response.data.result.profile?.skills?.length > 0) {
                    const skillNames = await fetchSkillsByIds(response.data.result.profile.skills);
                    setSkills(skillNames);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const decodeHTMLEntities = (text) => {
        if (typeof text !== 'string') return text;

        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    };

    const changeStatus = async (newStatus) => {
        const actionText = newStatus === 2 ? "Hibernate" : "Delete";
        const confirm = await Swal.fire({
            title: `Are you sure you want to ${actionText} your account?`,
            text: newStatus === 2
                ? "You can reactivate your account later by logging in again."
                : "This will delete your account. You will need to appeal to reactivate.",
            icon: newStatus === 2 ? "warning" : "error",
            showCancelButton: true,
            confirmButtonColor: newStatus === 2 ? "#f59e0b" : "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, ${actionText}`,
        });

        if (!confirm.isConfirmed) return;

        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const answer = num1 + num2;

        const captcha = await Swal.fire({
            title: "Captcha Verification",
            text: `What is ${num1} + ${num2} ?`,
            input: "text",
            inputPlaceholder: "Enter your answer",
            inputValidator: (value) => {
                if (!value) return "Please enter the answer!";
                if (parseInt(value) !== answer) return "Wrong answer. Try again.";
                return null;
            },
            showCancelButton: true,
            confirmButtonText: "Verify",
            cancelButtonText: "Cancel",
        });

        if (!captcha.isConfirmed) return;

        try {
            const res = await axios.patch(
                "http://localhost:3000/api/auth/status",
                { ac_status: newStatus },
                { withCredentials: true }
            );

            await Swal.fire({
                icon: "success",
                title: "Status Changed",
                text: res.data.message,
            });

            navigate("/login");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data || "Status change failed",
            });
        }
    };

    if (loading) {
        return <ProfileShimmer isMobile={isMobile} />;
    }

    if (!userData) {
        return <div className="error-message">Failed to load user data</div>;
    }

    const formatDate = (dateString) => {
        return dateString ? dayjs(dateString).format("MMM YYYY") : "Present";
    };

    const renderEmploymentType = (type) => {
        return type === 1 ? 'Full-time' :
            type === 2 ? 'Part-time' :
                type === 3 ? 'Contract' : 'Freelance';
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} closeOnClick={false} />
            {user?.role === 3 && [2, 3].includes(user?.ac_status) && (
                <div className="status-banner">
                    {user.ac_status === 2 && (
                        <span className="warning">
                            Account <strong>hibernated</strong>. <a href="#">Activate</a>
                        </span>
                    )}
                    {user.ac_status === 3 && (
                        <span className="error">
                            Account <strong>deleted</strong>. <a href="#">Appeal</a>
                        </span>
                    )}
                </div>
            )}

            <Wrapper isMobile={isMobile}>
                {/* New Profile Header */}
                <ProfileHeader
                    userData={userData}
                    isMobile={isMobile}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {!isMobile && (
                    <div className="desktop-tabs">
                        <button
                            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            View Details
                        </button>
                        <button
                            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
                            onClick={() => setActiveTab('activity')}
                        >
                            Activity & Insights
                        </button>
                    </div>
                )}

                {activeTab === 'details' && (
                    <>
                        {/* Basic Information Section - Updated with sub-cards */}
                        <div className="wrapper">
                            <h5 className="title">Basic Information</h5>
                            <div className="info-cards-container">
                                <div className="info-card">
                                    <h6>Basic Details</h6>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Status:</span>
                                            <span className="info-value">
                                                {userData?.ac_status === 1 ? "✅ Active" :
                                                    userData?.ac_status === 2 ? "⏸ Hibernated" :
                                                        "❌ Deleted"}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Name:</span>
                                            <span className="info-value">{userData?.full_name || "-"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Username:</span>
                                            <span className="info-value">{userData?.username || "-"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Role:</span>
                                            <span className="info-value">
                                                {userData?.role === 1 ? 'Admin' :
                                                    userData?.role === 2 ? 'Recruiter' :
                                                        'User'}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Email:</span>
                                            <div className="info-value-container">
                                                <span className="info-value email">{userData?.email || "-"}
                                                    {userData?.is_mail_verified ? (
                                                        <img src="/greenverify.svg" alt="Verified" width={16} height={16} className="verified-badge" />
                                                    ) : (
                                                        <span className="not-verified-text">Not Verified</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Joined:</span>
                                            <span className="info-value">{date || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <h6>Personal Details</h6>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Location:</span>
                                            <span className="info-value">{userData?.location || "-"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Gender:</span>
                                            <span className="info-value">{userData?.gender || "-"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Date of Birth:</span>
                                            <span className="info-value">{dob || "-"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Phone:</span>
                                            <div className="info-value-container">
                                                <span className="info-value">
                                                    {userData?.mobile_no || "-"}
                                                    {userData?.is_mo_verified ? (
                                                        <img src="/greenverify.svg" alt="Verified" width={16} height={16} className="verified-badge" />
                                                    ) : (
                                                        <span
                                                            className="not-verified-text clickable "
                                                            onClick={() => navigate(`/dashboard/edit-profile/${userData?.id}`)}
                                                        >
                                                            Not Verified
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Resume:</span>
                                            <span className="info-value">
                                                {userData?.resume ? (
                                                    <a href={userData.resume} target="_blank" rel="noopener noreferrer">
                                                        View Resume
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Job Preference:</span>
                                            <span className="info-value">
                                                {userData?.preference === 1
                                                    ? "Job Only"
                                                    : userData?.preference === 2
                                                        ? "Internships Only"
                                                        : userData?.preference === 3
                                                            ? "Both"
                                                            : "-"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Profile Section */}
                        {user?.role === 3 && userData.profile && (
                            <div className="wrapper">
                                <div className="section-header">
                                    <h5 className="title">Profile</h5>
                                </div>
                                <div className="profile-details">
                                    {userData.profile.about && (
                                        <div className="detail-item">
                                            <h6>About</h6>
                                            <p className="line-clamp">{userData.profile.about}</p>
                                        </div>
                                    )}
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Designation</span>
                                            <span className="detail-value">{userData.profile.designation || "-"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Course</span>
                                            <span className="detail-value">{userData.profile.course_name || "-"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Specialization</span>
                                            <span className="detail-value">{userData.profile.specialization || "-"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Institution</span>
                                            <span className="detail-value">{userData.profile.college_org_name || "-"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Experience</span>
                                            <span className="detail-value">{userData.profile.work_experience || "0"} years</span>
                                        </div>
                                        {userData.profile.full_address && (
                                            <div className="detail-item full-width">
                                                <span className="detail-label">Address</span>
                                                <span className="detail-value address-value line-clamp">
                                                    {decodeHTMLEntities(userData.profile.full_address)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills Section */}
                        {user?.role === 3 && skills.length > 0 && (
                            <div className="wrapper">
                                <div className="section-header">
                                    <h5 className="title">Key Skills</h5>
                                </div>
                                <div className="skills-container">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education Section */}
                        {[2, 3].includes(user?.role) && userData.educations?.length > 0 && (
                            <div className="wrapper">
                                <div className="section-header">
                                    <h5 className="title">Education</h5>
                                </div>
                                <div className="education-list">
                                    {userData.educations.map((edu, index) => (
                                        <div key={index} className="education-item">
                                            <div className="edu-header">

                                                <h6><span className="edu-label">Course :</span>{edu.course_name}</h6>
                                                <span className="edu-years">{edu.start_year} - {edu.end_year}</span>
                                            </div>
                                            <div className="edu-details">
                                                <div className="edu-detail">
                                                    <span className="edu-label">Institution:</span>
                                                    <span>{edu.college_name}</span>
                                                </div>
                                                {edu.specialization && (
                                                    <div className="edu-detail">
                                                        <span className="edu-label">Specialization:</span>
                                                        <span>{edu.specialization}</span>
                                                    </div>
                                                )}
                                                <div className="edu-detail">
                                                    <span className="edu-label">Score:</span>
                                                    <span>{edu.percentage_cgpa}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Work Experience Section */}
                        {[2, 3].includes(user?.role) && userData.work_experiences?.length > 0 && (
                            <div className="wrapper">
                                <div className="section-header">
                                    <h5 className="title">Experience</h5>
                                </div>
                                <div className="experience-list">
                                    {userData.work_experiences.map((exp, index) => (
                                        <div key={index} className="experience-item">
                                            <div className="exp-header">
                                                <h6>{exp.designation}</h6>
                                                <span className="exp-company">{exp.company_name}</span>
                                            </div>
                                            <div className="exp-details">
                                                <div className="exp-detail">
                                                    <span className="exp-label">Type:</span>
                                                    <span>{renderEmploymentType(exp.employment_type)}</span>
                                                </div>
                                                <div className="exp-detail">
                                                    <span className="exp-label">Location:</span>
                                                    <span>{exp.location}</span>
                                                </div>
                                                <div className="exp-detail">
                                                    <span className="exp-label">Duration:</span>
                                                    <span>
                                                        {formatDate(`${exp.start_year}-${exp.start_month}-01`)} - {' '}
                                                        {exp.currently_working ? 'Present' :
                                                            exp.end_year ? formatDate(`${exp.end_year}-${exp.end_month}-01`) : 'Present'}
                                                    </span>
                                                </div>
                                                {exp.description && (
                                                    <div className="exp-description">
                                                        <p className="line-clamp">{exp.description}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certificates Section */}
                        {user?.role === 3 && userData.certificates?.length > 0 && (
                            <div className="wrapper">
                                <div className="section-header">
                                    <h5 className="title">Certificates</h5>
                                </div>
                                <div className="certificate-list">
                                    {userData.certificates.map((cert, index) => (
                                        <div key={index} className="certificate-item">
                                            <h6>{cert.title}</h6>
                                            <div className="cert-details">
                                                <div className="cert-detail">
                                                    <span className="cert-label">Issued by:</span>
                                                    <span>{cert.issuing_organization}</span>
                                                </div>
                                                <div className="cert-detail">
                                                    <span className="cert-label">Issued on:</span>
                                                    <span>{formatDate(cert.issue_date)}</span>
                                                </div>
                                                {cert.expiry_date && (
                                                    <div className="cert-detail">
                                                        <span className="cert-label">Expires:</span>
                                                        <span>{formatDate(cert.expiry_date)}</span>
                                                    </div>
                                                )}
                                                {cert.description && (
                                                    <div className="cert-description">
                                                        <p className="line-clamp">{cert.description}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {cert.credential_url && (
                                                <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="credential-link">
                                                    View Credential
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects Section */}
                        {user?.role === 3 && userData.projects?.length > 0 && (
                            <div className="wrapper">
                                <div className="section-header">
                                    <h5 className="title">Projects</h5>
                                </div>
                                <div className="project-list">
                                    {userData.projects.map((project, index) => (
                                        <div key={index} className="project-item">
                                            <h6>{project.title}</h6>
                                            <div className="project-meta">
                                                <span className={`status-badge ${project.is_ongoing ? 'ongoing' : 'completed'}`}>
                                                    {project.is_ongoing ? 'Ongoing' : 'Completed'}
                                                </span>
                                                <span className="project-duration">
                                                    {formatDate(project.start_date)} - {' '}
                                                    {project.is_ongoing ? 'Present' :
                                                        project.end_date ? formatDate(project.end_date) : 'Present'}
                                                </span>
                                            </div>
                                            {project.description && (
                                                <div className="project-description">
                                                    <p className="line-clamp">{project.description}</p>
                                                </div>
                                            )}
                                            {project.project_url && (
                                                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="project-link">
                                                    View Project
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links Section */}
                        {user?.role === 3 && userData.profile?.social_links && (
                            <div className="wrapper">
                                <div className="section-header">
                                    <h5 className="title">Social Links</h5>
                                </div>
                                <div className="social-links-container">
                                    {/* LinkedIn */}
                                    {userData.profile.social_links.linkedin ? (
                                        <div className="social-link-item">
                                            <FiLinkedin className="social-icon" />
                                            <a
                                                href={userData.profile.social_links.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="active-link"
                                            >
                                                LinkedIn
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="social-link-item disabled">
                                            <FiLinkedin className="social-icon" />
                                            <span className="inactive-link">LinkedIn</span>
                                        </div>
                                    )}

                                    {/* GitHub */}
                                    {userData.profile.social_links.github ? (
                                        <div className="social-link-item">
                                            <FiGithub className="social-icon" />
                                            <a
                                                href={userData.profile.social_links.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="active-link"
                                            >
                                                GitHub
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="social-link-item disabled">
                                            <FiGithub className="social-icon" />
                                            <span className="inactive-link">GitHub</span>
                                        </div>
                                    )}

                                    {/* Portfolio */}
                                    {userData.profile.social_links.portfolio ? (
                                        <div className="social-link-item">
                                            <FiGlobe className="social-icon" />
                                            <a
                                                href={userData.profile.social_links.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="active-link"
                                            >
                                                Portfolio
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="social-link-item disabled">
                                            <FiGlobe className="social-icon" />
                                            <span className="inactive-link">Portfolio</span>
                                        </div>
                                    )}

                                    {/* Twitter */}
                                    {userData.profile.social_links.twitter ? (
                                        <div className="social-link-item">
                                            <FiTwitter className="social-icon" />
                                            <a
                                                href={userData.profile.social_links.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="active-link"
                                            >
                                                Twitter
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="social-link-item disabled">
                                            <FiTwitter className="social-icon" />
                                            <span className="inactive-link">Twitter</span>
                                        </div>
                                    )}

                                    {/* LeetCode */}
                                    {userData.profile.social_links.leetcode ? (
                                        <div className="social-link-item">
                                            <FiCode className="social-icon" />
                                            <a
                                                href={userData.profile.social_links.leetcode}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="active-link"
                                            >
                                                LeetCode
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="social-link-item disabled">
                                            <FiCode className="social-icon" />
                                            <span className="inactive-link">LeetCode</span>
                                        </div>
                                    )}

                                    {/* Other */}
                                    {userData.profile.social_links.other ? (
                                        <div className="social-link-item">
                                            <FiLink className="social-icon" />
                                            <a
                                                href={userData.profile.social_links.other}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="active-link"
                                            >
                                                Other
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="social-link-item disabled">
                                            <FiLink className="social-icon" />
                                            <span className="inactive-link">Other</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'activity' && (
                    <div className="wrapper">
                        <h5 className="title">Activity & Insights</h5>
                        <div className="empty-state">
                            <p>Activity & Insights will be shown here</p>
                        </div>
                    </div>
                )}
            </Wrapper>
        </>
    );
};

const HeaderWrapper = styled.div`
/* Styling for the main header wrapper */
.profile-header  {
  position: relative;
  width: 100%;
  background-image: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  color: #fff;
  padding: 3rem 1.5rem 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  padding-bottom: 2.5rem;
    margin-bottom: 2rem;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
}

@media (min-width: 768px) {
  .profile-header {
    flex-direction: row;
    justify-content: flex-start;
    gap: 3rem;
    text-align: left;
  }
}

/* Avatar and Edit Button Container */
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .avatar-container {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
}

/* Circle Progress Bar and Avatar */
.circle-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    var(--progress-color, #34d399) calc(var(--profile-completion, 0) * 1%),
    #e5e7eb calc(var(--profile-completion, 0) * 1%)
  );
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(52, 211, 153, 0.5);
  transition: all 0.5s ease-in-out;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #182848;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.inner-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #313e5e;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.profile-img:hover {
  transform: scale(1.05);
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.avatar-placeholder:hover {
  color: #a0a0a0;
}

.percentage-label {
  position: absolute;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #34d399;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Edit Profile Button */
.px-8.py-2 {
  padding: 0.75rem 2rem;
  background-color: #3b82f6;
  border-radius: 9999px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.px-8.py-2:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

/* Profile Information */
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .profile-info {
    align-items: flex-start;
  }
}

.profile-info h2 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.profile-info h3 {
  font-size: 1.2rem;
  font-weight: 400;
  color: #b0c4de;
  margin: 0;
}

.last-updated {
  font-size: 0.8rem;
  color: #d3d3d3;
  font-style: italic;
}

/* Mobile Tabs */
.mobile-tabs {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
  gap: 1rem;
}

@media (min-width: 768px) {
  .mobile-tabs {
    display: none;
  }
}

.tab {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.tab.active {
  background-color: #fff;
  color: #182848;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Dynamic background based on progress color prop */
[style*="--progress-color"] .circle-container {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2), 0 0 20px var(--progress-color, #34d399);
}

.percentage-label {
  background-color: var(--progress-color, #34d399);
}
`;

const Wrapper = styled.div`
/*
  ========================================
  Main Wrapper and Layout
  ========================================
*/
.wrapper {
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    transition: all 0.3s ease;
}

.wrapper:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 20px;
    border-bottom: 2px solid var(--primary-color);
    display: inline-block;
    padding-bottom: 8px;
    position: relative;
}

.title::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
}

.wrapper:hover .title::after {
    transform: scaleX(1);
}

/*
  ========================================
  Profile Header
  ========================================
*/
.ProfileHeader {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: #fff;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.ProfileHeader::before {
    content: '';
    position: absolute;
    top: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: rotate(30deg);
}

.ProfileHeader::after {
    content: '';
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    transform: rotate(-30deg);
}

.profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 5px solid #fff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    margin-bottom: 15px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.profile-avatar:hover {
    transform: scale(1.05) rotate(5deg);
}

.profile-name {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 5px;
    letter-spacing: 1px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.profile-bio {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    max-width: 600px;
    margin: 0 auto 20px;
    line-height: 1.5;
}

.desktop-tabs {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 24px;
}

.tab {
    background-color: var(--card-bg);
    border: none;
    padding: 12px 25px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
}

.tab:hover {
    background-color: var(--primary-color-light);
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.tab.active {
    background: var(--primary-color);
    color: #000;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border-color: var(--primary-color);
}

/*
  ========================================
  Info Cards
  ========================================
*/
.info-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.info-card {
    background-color: var(--background-color);
    border-radius: 10px;
    padding: 20px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.03);
    border: 1px solid var(--border-color);
}

.info-card h6 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
}

.info-grid,
.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.info-item,
.detail-item {
    display: flex;
    flex-direction: column;
}

.info-label,
.detail-label {
    font-weight: 500;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 4px;
}

.info-value,
.detail-value {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
}

.info-value-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.verified-badge {
    filter: drop-shadow(0 1px 2px rgba(0, 128, 0, 0.4));
}

.not-verified-text {
    font-size: 0.8rem;
    font-weight: 500;
    color: red;
    cursor: default;
}

.not-verified-text.clickable {
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s ease;
}

.not-verified-text.clickable:hover {
    color: var(--primary-color);
}

/*
  ========================================
  Profile Details
  ========================================
*/
.profile-details {
    padding: 20px;
    background-color: var(--background-color);
    border-radius: 10px;
    border: 1px solid var(--border-color);
}

.detail-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.detail-item h6 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
}

.detail-item p {
    color: var(--text-secondary);
    line-height: 1.6;
}

.full-width {
    grid-column: 1 / -1;
}

/*
  ========================================
  Skills
  ========================================
*/
.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.skill-tag {
    background-color: var(--primary-color-light);
    color: var(--primary-color);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.skill-tag:hover {
    background-color: var(--primary-color);
    color: #fff;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/*
  ========================================
  Lists (Education, Experience, Certificates, Projects)
  ========================================
*/
.education-list,
.experience-list,
.certificate-list,
.project-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.education-item,
.experience-item,
.certificate-item,
.project-item {
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 20px;
    position: relative;
    transition: all 0.3s ease;
    background-color: var(--background-color);
}

.education-item:hover,
.experience-item:hover,
.certificate-item:hover,
.project-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transform: translateY(-3px);
}

.edu-header,
.exp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
}

.edu-header h6,
.exp-header h6,
.certificate-item h6,
.project-item h6 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
}

.edu-years,
.exp-duration,
.status-badge {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
    background-color: var(--border-color);
    padding: 4px 10px;
    border-radius: 50px;
    white-space: nowrap;
}

.edu-details,
.exp-details,
.cert-details,
.project-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-top: 10px;
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.edu-detail,
.exp-detail,
.cert-detail {
    display: flex;
    align-items: center;
    gap: 8px;
}

.edu-detail span:first-child,
.exp-detail span:first-child,
.cert-detail span:first-child {
    font-weight: 600;
    color: var(--text-primary);
}

.exp-description,
.cert-description,
.project-description {
    margin-top: 15px;
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.6;
}

.credential-link,
.project-link {
    display: inline-block;
    margin-top: 15px;
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
}

.credential-link:hover,
.project-link:hover {
    color: var(--primary-color-dark);
    text-decoration: underline;
    transform: translateX(5px);
}

/*
  ========================================
  Social Links
  ========================================
*/
.social-links-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.social-link-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    border-radius: 50px;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
}

.social-link-item:hover {
    background-color: var(--primary-color-light);
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-link-item.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--background-color);
}

.social-link-item.disabled:hover {
    background-color: var(--background-color);
    box-shadow: none;
}

.social-icon {
    font-size: 1.2rem;
    color: var(--primary-color);
    transition: color 0.2s ease;
}

.social-link-item.disabled .social-icon {
    color: var(--text-secondary);
}

.active-link {
    color: var(--text-primary);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;
}

.social-link-item:hover .active-link {
    color: var(--primary-color);
}

.inactive-link {
    color: var(--text-secondary);
    font-weight: 500;
}

/*
  ========================================
  Empty State
  ========================================
*/
.empty-state {
    text-align: center;
    padding: 50px 20px;
    border: 2px dashed var(--border-color);
    border-radius: 10px;
    color: var(--text-secondary);
    font-style: italic;
    background-color: var(--background-color);
}

/*
  ========================================
  Utility Classes
  ========================================
*/
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.status-badge {
    text-transform: capitalize;
}

.status-badge.ongoing {
    background-color: var(--accent-blue-light);
    color: var(--accent-blue);
}

.status-badge.completed {
    background-color: var(--accent-green-light);
    color: var(--accent-green);
}
   `
export default Profile;
