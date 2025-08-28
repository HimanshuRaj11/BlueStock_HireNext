import React, { useState, useEffect, useCallback, useRef } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoArrowBack } from 'react-icons/io5';
import LoadingComTwo from "../components/shared/LoadingComTwo";
import { EducationForm } from "../components/EducationForm";
import { CertificateForm } from "../components/CertificateForm";
import { ProjectForm } from "../components/ProjectForm";
import { useMediaQuery } from 'react-responsive';
import { WorkExperienceForm } from "../components/WorkExperienceForm";
import { UserProfileForm } from "../components/UserProfileForm";
import { fetchSkillsByName, fetchSkillsByIds, fetchSuggestedSkills } from "../utils/skillsHelper";
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { setUpRecaptcha, auth } from "../firebase";
import Box from '@mui/material/Box';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getSingleHandler } from "../utils/FetchHandlers";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import calculateProfileCompletion from "../utils/profileCompletion";
const queryClient = new QueryClient();

import { set, useForm } from "react-hook-form";

import Swal from "sweetalert2";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SkillsAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Type to search skills...",
  showSuggestionsSection = true
}) => {
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [loading, setLoading] = useState({
    current: false,
    search: false,
    suggested: false
  });
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  // Load current skill names when IDs change
  useEffect(() => {
    const loadCurrentSkills = async () => {
      if (!value || value.length === 0) {
        setCurrentSkills([]);
        return;
      }

      setLoading(prev => ({ ...prev, current: true }));
      setError(null);
      
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        
        const skills = await fetchSkillsByIds(value, { 
          signal: abortControllerRef.current.signal 
        });
        setCurrentSkills(skills);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load current skills');
          console.error(err);
        }
      } finally {
        setLoading(prev => ({ ...prev, current: false }));
      }
    };
    
    loadCurrentSkills();
  }, [value]);

  // Load suggested skills on first render
  useEffect(() => {
    if (!showSuggestionsSection) return;

    const loadSuggestedSkills = async () => {
      setLoading(prev => ({ ...prev, suggested: true }));
      
      try {
        const skills = await fetchSuggestedSkills();
        setSuggestedSkills(skills);
      } catch (err) {
        console.error('Failed to load suggested skills:', err);
      } finally {
        setLoading(prev => ({ ...prev, suggested: false }));
      }
    };

    loadSuggestedSkills();
  }, [showSuggestionsSection]);

  // Search for skills when debounced input changes
  useEffect(() => {
    const searchSkills = async () => {
      if (debouncedSearchTerm.length < 2) {
        setFilteredSkills([]);
        setShowSearchSuggestions(false);
        return;
      }

      setLoading(prev => ({ ...prev, search: true }));
      setError(null);
      
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        
        const skills = await fetchSkillsByName(debouncedSearchTerm, { 
          signal: abortControllerRef.current.signal 
        });
        
        setFilteredSkills(skills);
        setShowSearchSuggestions(skills.length > 0);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to search skills');
          console.error(err);
          setFilteredSkills([]);
          setShowSearchSuggestions(false);
        }
      } finally {
        setLoading(prev => ({ ...prev, search: false }));
      }
    };
    
    searchSkills();
  }, [debouncedSearchTerm]);

  const handleAddSkill = useCallback((skill) => {
    if (value.length >= 20) {
      toast.error('You can only add up to 20 skills');
      return;
    }
    
    if (!value.includes(skill.id)) {
      onChange([...value, skill.id]);
      
      // Remove from suggested skills if it was there
      setSuggestedSkills(prev => 
        prev.filter(s => s.id !== skill.id)
      );
    }
    setInputValue("");
    setShowSearchSuggestions(false);
  }, [value, onChange]);

  const handleRemoveSkill = useCallback((skillId) => {
    const updatedSkills = value.filter(id => id !== skillId);
    onChange(updatedSkills);
  }, [value, onChange]);

  const filteredSuggestedSkills = suggestedSkills.filter(
    skill => !value.includes(skill.id)
  );

  return (
    <div className="skills-autocomplete">
      {/* Display current skills as tags */}
      <div className="skills-tags">
        {loading.current && <span>Loading skills...</span>}
        {error && <span className="error">{error}</span>}
        {currentSkills.length > 0 ? (
          currentSkills.map(skill => (
            <span key={skill.id} className="skill-tag">
              {skill.name}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.id)}
                className="remove-skill"
                aria-label={`Remove ${skill.name}`}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="no-skills"></span>
        )}
      </div>

      {/* Search input */}
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="skills-input"
          onFocus={() => inputValue && setShowSearchSuggestions(filteredSkills.length > 0)}
        />
        
        {/* Search suggestions dropdown */}
        {showSearchSuggestions && (
          <div className="suggestions-dropdown">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="suggestion-item"
                onClick={() => handleAddSkill(skill)}
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested skills section */}
      {showSuggestionsSection && suggestedSkills.length > 0 && (
        <div className="suggested-skills-section">
          <h4>Suggested Skills</h4>
          <div className="suggested-skills-container">
            {suggestedSkills
              .filter(skill => !value.includes(skill.id))
              .slice(0, 8)
              .map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className="suggested-skill-tag"
                  onClick={() => handleAddSkill(skill)}
                >
                  {skill.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EditProfile = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [education, setEducation] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [aboutText, setAboutText] = useState("");
  const [candidateSocialLinks, setCandidateSocialLinks] = useState({});
  const [showCandidateSocialLinksForm, setShowCandidateSocialLinksForm] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [showWorkExperienceForm, setShowWorkExperienceForm] = useState(false);
  const [isMobileEdited, setIsMobileEdited] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // Add this state
  const { id } = useParams();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { user, handleFetchMe } = useUserContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("basic");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState({
    mobile: false,
    email: false
  });
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Social Links State
  const [socialLinks, setSocialLinks] = useState({});
  const [showSocialLinksForm, setShowSocialLinksForm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

    useEffect(() => {
    if (user) {
      setIsAuthReady(true);
    }
  }, [user]);

  // Fetch user profile if candidate
  useEffect(() => {
    if (user?.role === 3) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/user-profile",
            { withCredentials: true }
          );
          setUserProfile(response.data);
          const skillIds = response.data.skills || [];
          setSkills(skillIds);
          if (skillIds.length > 0) {
            const skillDetails = await fetchSkillsByIds(skillIds);
            setCurrentSkills(skillDetails);
          }
          setAboutText(response.data.about || "");
          setFullAddress(response.data.full_address || "");
          setCandidateSocialLinks(response.data.social_links || {});
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthReady) return;

    const fetchSkills = async () => {
      try {
        let response;
        if (user?.role === 3) {
          response = await axios.get(
            "http://localhost:3000/api/user-profile/skills",
            { withCredentials: true }
          );
          const skillsData = response.data?.skills || 
                            response.data?.result?.skills || 
                            response.data;
          if (Array.isArray(skillsData)) {
            setSkills(skillsData.map(skill => skill.id || skill));
          }
        } else if (user?.role === 2) {
          response = await axios.get(
            "http://localhost:3000/api/recruiter-profile/skills",
            { withCredentials: true }
          );
          const skillsData = response.data?.skills || 
                            response.data?.result?.skills || 
                            response.data;
          if (Array.isArray(skillsData)) {
            setSkills(skillsData.map(skill => skill.id || skill));
          }
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    
    fetchSkills();
  }, [user, isAuthReady]);

  function LinearProgressWithLabel(props) {
    const getProgressColor = (value) => {
      if (value <= 10) return 'error'; // red
      if (value <= 60) return 'warning'; // yellow
      return 'success'; // green
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={props.value}
            color={getProgressColor(props.value)}
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  // Calculate profile completion
  useEffect(() => {
    const profileData = {
      education,
      certificates,
      projects,
      skills,
      about: aboutText,
      social_links: candidateSocialLinks,
      full_address: fullAddress,
      workExperiences,
      userProfile,
      recruiterProfile
    };
    
    setProfileCompletion(calculateProfileCompletion(user, profileData));
  }, [user, recruiterProfile, education, workExperiences, userProfile, skills, projects, certificates, aboutText, candidateSocialLinks, fullAddress]);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const fetchWorkExperiences = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/work-experience",
        { withCredentials: true }
      );
      setWorkExperiences(response.data);
    } catch (error) {
      console.error("Error fetching work experiences:", error);
    }
  };

  // Add this function to handle resume update
  const handleUpdateResume = async () => {
    const resumeLink = watch("resume"); // Get the current value from the form
    
    // Validate the resume link
    if (!resumeLink || typeof resumeLink !== 'string') {
      toast.error('Please enter a valid resume link');
      return;
    }

    if (!resumeLink.startsWith('https://')) {
      toast.error('Resume link must start with https://');
      return;
    }

    const toastId = toast.loading("Updating resume...", {
      autoClose: false,
      closeOnClick: false,
      draggable: false
    });

    try {
      await axios.patch(
        "http://localhost:3000/api/users/update-resume",
        { resume: resumeLink },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.update(toastId, {
        render: "Resume updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });

      // Refresh user data
      await handleFetchMe();
    } catch (error) {
      console.error("Error updating resume:", error);
      let errorMessage = "Failed to update resume";
      
      if (error.response) {
        // Handle specific error messages from server
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid resume link format";
        } else if (error.response.status === 500) {
          errorMessage = "Server error occurred. Please try again later.";
        }
      }

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
    }
  };

  const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return '';
    
    const date = new Date(isoDateString);
    const localDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Fetch recruiter profile if user is recruiter
  useEffect(() => {
    if (user?.role === 2) {
      const fetchRecruiterProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/recruiter-profile",
            { withCredentials: true }
          );
          const profile = response.data.result;
          setRecruiterProfile(profile);
          
          // Set form values for recruiter fields
          if (profile) {
            setValue("purpose", profile.purpose || "");
            setValue("designation", profile.designation || "");
            setValue("work_experience_years", profile.work_experience_years || 0);
            setValue("current_company", profile.current_company || "");
            setValue("company_email", profile.company_email || "");
            setValue("about", profile.about || "");
            setValue("full_address", profile.full_address || "");

            if (profile.social_links) {
              setSocialLinks(profile.social_links);
            }
          }
        } catch (error) {
          console.error("Error fetching recruiter profile:", error);
        }
      };
      fetchRecruiterProfile();
    }
  }, [user, setValue]);

  useEffect(() => {
    const currentMobile = watch("mobile_no");
    if (currentMobile && currentMobile !== user?.mobile_no) {
      const resetVerification = async () => {
        try {
          await axios.patch(
            "http://localhost:3000/api/users/update-mobile-edit",
            {},
            { withCredentials: true }
          );
          setVerificationStatus(prev => ({ ...prev, mobile: false }));
          setIsMobileEdited(true);
        } catch (error) {
          console.error("Error resetting verification:", error);
        }
      };
      
      resetVerification();
    }
  }, [watch("mobile_no"), user?.mobile_no]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating profile...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false
    });
    
    try {
      // Common fields for all users - include all existing user data to prevent loss
      const updateUser = {
        full_name: user?.full_name,
        email: user?.email,
        username: user?.username,
        location: user?.location,
        heading: data.heading || null,
        gender: user?.gender,
        ...((user?.role === 3 || user?.role === 2) && {
          dob: user?.dob,
          mobile_no: user?.mobile_no
        }),
        ...(user?.role === 3 && {
          preference: user?.preference
        })
      };
      
      // Update with new values from form (excluding resume)
      if (data.full_name) updateUser.full_name = data.full_name;
      if (data.username) updateUser.username = data.username;
      if (data.location) updateUser.location = data.location;
      if (data.gender) updateUser.gender = data.gender;
      if (data.heading) updateUser.heading = data.heading;

      if (user?.role === 3 || user?.role === 2) {
        if (data.dob) updateUser.dob = data.dob;
        if (data.mobile_no) updateUser.mobile_no = data.mobile_no;
      }

      if (user?.role === 3) {
        if (data.preference) updateUser.preference = parseInt(data.preference);
      }

      // First update user data
      await axios.patch(
        `http://localhost:3000/api/users/update`,
        updateUser,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Then update recruiter-specific data if recruiter
      if (user?.role === 2) {
        await axios.patch(
          "http://localhost:3000/api/recruiter-profile",
          {
            purpose: data.purpose,
            designation: data.designation,
            work_experience_years: parseFloat(data.work_experience_years),
            current_company: data.current_company,
            company_email: data.company_email,
            about: data.about,
            full_address: data.full_address,
            social_links: socialLinks
          },
          { withCredentials: true }
        );
      }

      toast.update(toastId, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });

      await handleFetchMe();
      setTimeout(() => navigate("/dashboard"), 100);
    } catch (error) {
      let errorMessage = "Failed to update profile";
      if (error.response?.status === 409) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data?.message || errorMessage;
      } else if (error.response?.status === 400) {
        errorMessage = Array.isArray(error.response.data.error)
          ? error.response.data.error[0].msg
          : error.response.data.error?.msg || errorMessage;
      }

      toast.update(toastId, {
        render: `${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        draggable: true
      });
    }
  };

  // Social Links Functions
  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSocialLink = () => {
    setShowSocialLinksForm(true);
  };

  const handleSaveSocialLinks = async () => {
    const toastId = toast.loading("Updating social links...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false
    });

    // Validate URLs
    const invalidLinks = Object.entries(socialLinks)
      .filter(([_, value]) => value && !value.startsWith("https://"))
      .map(([key]) => key);

    if (invalidLinks.length > 0) {
      toast.update(toastId, {
        render: `Links must start with 'https://': ${invalidLinks.join(', ')}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
      return;
    }

    try {
      await axios.patch(
        "http://localhost:3000/api/user-profile/social-links",
        { social_links: socialLinks },
        { withCredentials: true }
      );

      toast.update(toastId, {
        render: "Social links updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
      setShowSocialLinksForm(false);
    } catch (error) {
      toast.update(toastId, {
        render: `${error.response?.data?.message || "Failed to update links"}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
    }
  };

  const fetchEducation = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/education",
        { withCredentials: true }
      );
      setEducation(response.data.result);
    } catch (error) {
      console.error("Error fetching education:", error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/certificates",
        { withCredentials: true }
      );
      setCertificates(response.data.result);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/projects",
        { withCredentials: true }
      );
      setProjects(response.data.result);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user-profile",
        { withCredentials: true }
      );
      const profile = response.data;
      setUserProfile(profile);
      setAboutText(profile?.about || "");
      setFullAddress(profile?.full_address || "");
      setCandidateSocialLinks(profile?.social_links || {});
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setAboutText("");
      setFullAddress("");
      setCandidateSocialLinks({});
    }
  };

  useEffect(() => {
    if (user?.role === 3) {
      fetchUserProfile();
    }
  }, [user?.role]);

  const handleCandidateAboutChange = (e) => {
    setAboutText(e.target.value);
  };

  const handleCandidateSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setCandidateSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAbout = async () => {
    const toastId = toast.loading("Updating about section...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false
    });

    try {
      await axios.patch(
        "http://localhost:3000/api/user-profile/about",
        { about: aboutText, full_address: fullAddress },
        { withCredentials: true }
      );

      toast.update(toastId, {
        render: "About section updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
      fetchUserProfile();
    } catch (error) {
      toast.update(toastId, {
        render: `${error.response?.data?.message || "Failed to update about section"}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
    }
  };

  const handleSaveCandidateSocialLinks = async () => {
    const toastId = toast.loading("Updating social links...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false
    });

    // Validate URLs
    const invalidLinks = Object.entries(candidateSocialLinks)
      .filter(([_, value]) => value && !value.startsWith("https://"))
      .map(([key]) => key);

    if (invalidLinks.length > 0) {
      toast.update(toastId, {
        render: `Links must start with 'https://': ${invalidLinks.join(', ')}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
      return;
    }

    try {
      await axios.patch(
        "http://localhost:3000/api/user-profile/social-links",
        { social_links: candidateSocialLinks },
        { withCredentials: true }
      );

      toast.update(toastId, {
        render: "Social links updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
      setShowCandidateSocialLinksForm(false);
    } catch (error) {
      toast.update(toastId, {
        render: `${error.response?.data?.message || "Failed to update links"}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });
    }
  };

  useEffect(() => {
    if (user?.role === 3 || user?.role === 2) { 
      fetchWorkExperiences();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 3 || user?.role === 2) {
      fetchEducation();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 3) {
      fetchCertificates();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 3) {
      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setVerificationStatus({
        mobile: user.is_mo_verified || false,
        email: user.is_mail_verified || false
      });
    }
  }, [user]);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      setUpRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = watch("mobile_no");

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmationResult);
      
      toast.update(toastId, {
        render: "OTP sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      
      setOtpSent(true);
      setShowOtpInput(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.update(toastId, {
        render: error.message || "Failed to send OTP",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const toastId = toast.loading("Verifying mobile number...");
    
    try {
      const credential = await confirmationResult.confirm(otp);
      
      if (credential) {
        const updatedMobile = watch("mobile_no");
        await axios.patch(
          "http://localhost:3000/api/users/update-mobile-verification",
          { 
            mobile_no: updatedMobile,
            is_mo_verified: true 
          },
          { withCredentials: true }
        );

        setVerificationStatus(prev => ({ ...prev, mobile: true }));
        setIsMobileEdited(false);
        setShowOtpInput(false);
        setOtp("");
        toast.update(toastId, {
          render: "Mobile number verified successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
        
        await handleFetchMe();
      } else {
        throw new Error("Firebase verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.update(toastId, {
        render: error.response?.data?.message || "Invalid OTP. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });

      setOtp("");
    }
  };

  const handleSaveSkills = async () => {
    if (skills.length > 20) {
      toast.error('You can only have up to 20 skills');
      return;
    }

    const invalidSkills = skills.filter(skill => isNaN(Number(skill)));
    if (invalidSkills.length > 0) {
      toast.error(`Invalid skill IDs: ${invalidSkills.join(', ')}`);
      return;
    }

    const toastId = toast.loading("Updating skills...", {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false
    });

    try {
      let endpoint, payload;
      if (user?.role === 3) {
        endpoint = "http://localhost:3000/api/user-profile/skills";
        payload = { skills: skills.map(Number) };
      } else if (user?.role === 2) {
        endpoint = "http://localhost:3000/api/recruiter-profile/skills";
        payload = { skills: skills.map(Number) };
      }

      const response = await axios.patch(
        endpoint,
        payload,
        { withCredentials: true }
      );

      const updatedSkills = response.data?.skills || 
                          response.data?.result?.skills || 
                          response.data;
      
      if (Array.isArray(updatedSkills)) {
        setSkills(updatedSkills);
      } else {
        setSkills(skills);
      }

      toast.update(toastId, {
        render: "Skills updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating skills:", error);
      
      let errorMessage = error.response?.data?.message;
      
      if (error.response?.status === 404 && error.response?.data?.message?.includes("Profile not found")) {
        errorMessage = "Complete current details first";
      }

      toast.update(toastId, {
        render: `${error.response?.data?.message || "Complete current details first"}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        draggable: true
      });
    }
  };

  const isSectionComplete = (section) => {
    switch(section) {
      case 'basic':
        return user?.full_name && user?.username && user?.location && user?.gender;
      case 'resume':
        return user?.resume;
      case 'about':
        return user?.role === 2 ? recruiterProfile?.about : 
              user?.role === 3 ? aboutText : false;
      case 'current':
        return userProfile;
      case 'education':
        return education.length > 0;
      case 'certificates':
        return certificates.length > 0;
      case 'projects':
        return projects.length > 0;
      case 'experience':
        return workExperiences.length > 0;
      case 'skills':
        return skills.length > 0;
      case 'social':
        if (user?.role === 2) {
          return Object.keys(socialLinks).filter(key => socialLinks[key]).length > 0;
        }
        if (user?.role === 3) {
          return Object.keys(candidateSocialLinks).filter(key => candidateSocialLinks[key]).length > 0;
        }
        return false;
      default:
        return false;
    }
  };

  return (
    <Wrapper>
      <ToastContainer
        position="top-right"
        autoClose={5000} // 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="profile-container">
        <div className="title-row">
          <button 
            onClick={() => navigate('/dashboard')}
            className="back-btn"
          >
            <IoArrowBack className="text-xl" />
          </button>
          <h1>Edit Profile</h1>
        </div>

        <div className="progress-container">
          <LinearProgressWithLabel 
            value={profileCompletion} 
            sx={{
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </div>
        
        <div className="profile-layout">
          {isMobile ? (
            <div className="mobile-tabbar">
              <div className="tabbar-scroll">
                {[
                  { id: 'basic', label: 'Basic' },
                  { id: 'resume', label: 'Resume' },
                  ...(user?.role === 3 ? [{ id: 'current', label: 'Current' }] : []),
                  { id: 'skills', label: 'Skills' },
                  { id: 'education', label: 'Education' },
                  ...((user?.role === 2 || user?.role === 3) ? [{ id: 'about', label: 'About' }] : []),
                  ...(user?.role === 3 ? [{ id: 'experience', label: 'Experience' }] : []),
                  ...(user?.role === 3 ? [{ id: 'projects', label: 'Projects' }] : []),
                  { id: 'certificates', label: 'Certificates' },
                  { id: 'social', label: 'Social' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab ${activeSection === tab.id ? 'active' : ''} ${
                      isSectionComplete(tab.id) ? 'complete' : ''
                    }`}
                    onClick={() => setActiveSection(tab.id)}
                  >
                    {isSectionComplete(tab.id) ? (
                      <FaCheckCircle className="icon" />
                    ) : (
                      <FaRegCircle className="icon" />
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="sidebar">
              <ul>
                <li 
                  className={activeSection === 'basic' ? 'active' : ''}
                  onClick={() => setActiveSection('basic')}
                >
                  {isSectionComplete('basic') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                  Basic Details
                </li>
                
                <li 
                  className={activeSection === 'resume' ? 'active' : ''}
                  onClick={() => setActiveSection('resume')}
                >
                  {isSectionComplete('resume') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                  Resume
                </li>
                
                {user?.role === 3 && (
                  <li 
                    className={activeSection === 'current' ? 'active' : ''}
                    onClick={() => setActiveSection('current')}
                  >
                    {isSectionComplete('current') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                    Current Details
                  </li>
                )}
                
                {user?.role === 2 && (
                  <li 
                    className={activeSection === 'about' ? 'active' : ''}
                    onClick={() => setActiveSection('about')}
                  >
                    {isSectionComplete('about') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                    About
                  </li>
                )}

                {(user?.role === 3 || user?.role === 2) && (
                  <>
                    <li 
                      className={activeSection === 'education' ? 'active' : ''}
                      onClick={() => setActiveSection('education')}
                    >
                      {education.length > 0 ? (
                        <FaCheckCircle className="icon complete" />
                      ) : (
                        <FaRegCircle className="icon" />
                      )}
                      Education
                    </li>
                    <li 
                      className={activeSection === 'experience' ? 'active' : ''}
                      onClick={() => setActiveSection('experience')}
                    >
                      {workExperiences.length > 0 ? (
                        <FaCheckCircle className="icon complete" />
                      ) : (
                        <FaRegCircle className="icon" />
                      )}
                      Work Experience
                    </li>
                    <li 
                      className={activeSection === 'skills' ? 'active' : ''}
                      onClick={() => setActiveSection('skills')}
                    >
                      {isSectionComplete('skills') ? (
                        <FaCheckCircle className="icon complete" />
                      ) : (
                        <FaRegCircle className="icon" />
                      )}
                      Skills
                    </li>
                  </>
                )}

                {user?.role === 3 && (
                  <>
                    <li 
                      className={activeSection === 'certificates' ? 'active' : ''}
                      onClick={() => setActiveSection('certificates')}
                    >
                      {isSectionComplete('certificates') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                      Certificates
                    </li>
                    <li 
                      className={activeSection === 'projects' ? 'active' : ''}
                      onClick={() => setActiveSection('projects')}
                    >
                      {isSectionComplete('projects') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                      Projects
                    </li>
                  </>
                )}

                {user?.role === 3 && (
                  <>
                    <li 
                      className={activeSection === 'about' ? 'active' : ''}
                      onClick={() => setActiveSection('about')}
                    >
                      {isSectionComplete('about') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                      About
                    </li>
                    <li 
                      className={activeSection === 'social' ? 'active' : ''}
                      onClick={() => setActiveSection('social')}
                    >
                      {isSectionComplete('social') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                      Social Links
                    </li>
                  </>
                )}
                
                {user?.role === 2 && (
                  <li 
                    className={activeSection === 'social' ? 'active' : ''}
                    onClick={() => setActiveSection('social')}
                  >
                    {isSectionComplete('social') ? <FaCheckCircle className="icon complete" /> : <FaRegCircle className="icon" />}
                    Social Links
                  </li>
                )}
              </ul>
            </div>
          )}
          
          <div className="content">
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              {/* Basic Details Section */}
              {(activeSection === 'basic') && (
                <div className="section-content">
                  <h3>Basic Details</h3>
                  <div className="form-grid">
                    <div className="row">
                      <label htmlFor="full_name">Full Name</label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        placeholder="Type Here"
                        defaultValue={user?.full_name}
                        {...register("full_name", {
                          required: {
                            value: true,
                            message: "Full Name required",
                          },
                        })}
                      />
                      {errors?.full_name && (
                        <span className="error-message">
                          {errors?.full_name?.message}
                        </span>
                      )}
                    </div>
                    <div className="row">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Type Here"
                        defaultValue={user?.username}
                        {...register("username", {
                          required: {
                            value: true,
                            message: "Username required",
                          },
                          maxLength: {
                            value: 30,
                            message: "Too long (max 30char)",
                          },
                          minLength: {
                            value: 3,
                            message: "Too short (max 3char)",
                          },
                        })}
                      />
                      {errors?.username && (
                        <span className="error-message">
                          {errors?.username?.message}
                        </span>
                      )}
                    </div>

                    <div className="row">
                      <label htmlFor="email">Email</label>
                      <div className="email-field">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Type Here"
                          defaultValue={user?.email}
                          readOnly
                        />
                        {verificationStatus.email ? (
                          <div className="verified-badge">
                            <img src="/greenverify.svg" alt="Verified" width={16} height={16} />
                          </div>
                        ) : (
                          <div className="not-verified">Not Verified</div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <label htmlFor="role">Role</label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        placeholder="Type Here"
                        defaultValue={
                          user?.role === 1 ? 'Admin' : 
                          user?.role === 2 ? 'Recruiter' : 'Candidate'
                        }
                        readOnly
                      />
                    </div>

                    <div className="row">
                      <label htmlFor="location">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Location"
                        defaultValue={user?.location}
                        {...register("location", {
                          maxLength: {
                            value: 150,
                            message: "Too long (max 150char)",
                          },
                          minLength: {
                            value: 3,
                            message: "Too short (max 3char)",
                          },
                        })}
                      />
                      {errors?.location && (
                        <span className="error-message">
                          {errors?.location?.message}
                        </span>
                      )}
                    </div>

                    <div className="row">
                      <label htmlFor="gender">Gender<span className="text-red-500">*</span></label>
                      <select
                        name="gender"
                        id="gender"
                        defaultValue={user?.gender}
                        {...register("gender")}
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>

                    <div className="row">
                      <label htmlFor="heading">Professional Headline</label>
                      <input
                        type="text"
                        id="heading"
                        name="heading"
                        placeholder="e.g. Senior Software Engineer | Full Stack Developer"
                        defaultValue={user?.heading || ''}
                        {...register("heading", {
                          maxLength: {
                            value: 200,
                            message: "Maximum 200 characters allowed"
                          }
                        })}
                      />
                      {errors?.heading && (
                        <span className="error-message">
                          {errors?.heading?.message}
                        </span>
                      )}
                    </div>

                    {/* Recruiter Specific Fields */}
                    {user?.role === 2 && (
                      <>
                        <div className="row">
                          <label htmlFor="purpose">Purpose<span className="text-red-500">*</span></label>
                          <select
                            name="purpose"
                            id="purpose"
                            defaultValue={recruiterProfile?.purpose || ""}
                            {...register("purpose", {
                              required: "Purpose is required"
                            })}
                          >
                            <option value="">Select Purpose</option>
                            <option value="hire">Hiring</option>
                            <option value="host_hackathon">Host Hackathon</option>
                          </select>
                          {errors?.purpose && (
                            <span className="error-message">
                              {errors?.purpose?.message}
                            </span>
                          )}
                        </div>

                        <div className="row">
                          <label htmlFor="designation">Designation<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            id="designation"
                            name="designation"
                            placeholder="Your current designation"
                            defaultValue={recruiterProfile?.designation}
                            {...register("designation", {
                              required: "Designation is required",
                              maxLength: {
                                value: 100,
                                message: "Too long (max 100char)"
                              }
                            })}
                          />
                          {errors?.designation && (
                            <span className="error-message">
                              {errors?.designation?.message}
                            </span>
                          )}
                        </div>

                        <div className="row">
                          <label htmlFor="work_experience_years">Work Experience (Years)<span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            id="work_experience_years"
                            name="work_experience_years"
                            placeholder="Total years of experience"
                            step="0.1"  // Allow decimal values with 0.1 increments
                            min="0"
                            defaultValue={recruiterProfile?.work_experience_years}
                            {...register("work_experience_years", {
                              required: "Work experience is required",
                              min: {
                                value: 0,
                                message: "Must be 0 or more"
                              },
                              valueAsNumber: true,  // Ensure value is treated as number
                              validate: {
                                decimalPlaces: value => {
                                  const decimalPlaces = (value.toString().split('.')[1] || []).length;
                                  return decimalPlaces <= 1;
                                }
                              }
                            })}
                          />
                          {errors?.work_experience_years && (
                            <span className="error-message">
                              {errors?.work_experience_years?.message || 
                              (errors?.work_experience_years?.type === 'decimalPlaces' && 
                                "Maximum 1 decimal place allowed")}
                            </span>
                          )}
                        </div>

                        <div className="row">
                          <label htmlFor="current_company">Company/Organization<span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            id="current_company"
                            name="current_company"
                            placeholder="Current company name"
                            defaultValue={recruiterProfile?.current_company}
                            {...register("current_company", {
                              required: "Company name is required",
                              maxLength: {
                                value: 255,
                                message: "Too long (max 255char)"
                              }
                            })}
                          />
                          {errors?.current_company && (
                            <span className="error-message">
                              {errors?.current_company?.message}
                            </span>
                          )}
                        </div>

                        <div className="row">
                          <label htmlFor="company_email">Company Email<span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            id="company_email"
                            name="company_email"
                            placeholder="Official company email"
                            defaultValue={recruiterProfile?.company_email}
                            {...register("company_email", {
                              required: "Company email is required",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                              }
                            })}
                          />
                          {errors?.company_email && (
                            <span className="error-message">
                              {errors?.company_email?.message}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {/* Candidate Specific Fields */}
                    {(user?.role === 3 || user?.role === 2) && (
                      <>
                        <div className="row">
                          <label htmlFor="mobile_no">Mobile Number<span className="text-red-500">*</span></label>
                          <div className="phone-input-wrapper">
                            <PhoneInput
                              country={'in'}
                              value={user?.mobile_no || ''}
                              onChange={(value, country) => {
                                const formattedNumber = value.startsWith('+') ? value : `+${value}`;
                                setValue('mobile_no', formattedNumber, { shouldValidate: true });
                              }}
                              inputProps={{
                                name: 'mobile_no',
                                id: 'mobile_no',
                                required: true,
                              }}
                              containerClass="phone-input-container"
                              inputClass="phone-input-field"
                              buttonClass="phone-input-button"
                              dropdownClass="phone-input-dropdown"
                              searchClass="phone-input-search"
                              searchStyle={{
                                padding: '8px',
                                margin: '0 8px',
                                borderBottom: '1px solid #e2e8f0'
                              }}
                              dropdownStyle={{
                                maxHeight: '300px',
                                overflowY: 'auto'
                              }}
                              enableSearch
                              searchPlaceholder="Search country"
                              disableSearchIcon
                            />
                            {verificationStatus.mobile && !isMobileEdited ? (
                              <div className="verified-badge">
                                <img src="/greenverify.svg" alt="Verified" width={16} height={16} />
                              </div>
                            ) : (
                              <button 
                                type="button" 
                                className="verify-btn"
                                onClick={handleSendOtp}
                                disabled={!watch("mobile_no") || otpSent || isSendingOtp}
                              >
                                {isSendingOtp ? (
                                  <>
                                    <span className="spinner"></span> Sending...
                                  </>
                                ) : otpSent ? (
                                  'OTP Sent'
                                ) : (
                                  'Verify Now'
                                )}
                              </button>
                            )}
                          </div>
                          <div id="recaptcha-container" style={{ display: 'none' }}></div>
                        </div>

                          {showOtpInput && (
                            <div className="otp-container">
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                              />
                              <button 
                                type="button"
                                className="verify-otp-btn"
                                onClick={handleVerifyOtp}
                              >
                                Verify OTP
                              </button>
                            </div>
                          )}

                        <div className="row">
                          <label htmlFor="dob">
                            Date of Birth<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            id="dob"
                            name="dob"
                            defaultValue={formatDateForInput(user?.dob)}
                            {...register("dob", {
                              required: user?.role === 3 || user?.role === 2 ? "Date of birth is required" : false,
                            })}
                          />
                        </div>
                      </>
                    )}

                    {user?.role === 3 && (
                      <>
                        <div className="row">
                          <label htmlFor="preference">Job Preference<span className="text-red-500">*</span></label>
                          <select
                            name="preference"
                            id="preference"
                            defaultValue={user?.preference || ""}
                            {...register("preference")}
                          >
                            <option value="">Select Preference</option>
                            <option value="1">Job Only</option>
                            <option value="2">Internship Only</option>
                            <option value="3">Both Job and Internship</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {(activeSection === 'resume') && (
                <div className="section-content">
                  <h3>Resume</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      <label htmlFor="resume">Resume Link</label>
                      <input
                        type="text"
                        id="resume"
                        name="resume"
                        placeholder="Google Drive link (must start with https://)"
                        defaultValue={user?.resume}
                        {...register("resume", {
                          maxLength: {
                            value: 500,
                            message: "Enter valid link",
                          },
                        })}
                      />
                      {errors?.resume && (
                        <span className="error-message">
                          {errors?.resume?.message}
                        </span>
                      )}
                      <p className="help-text">
                        Upload your resume to Google Drive and share the link here
                      </p>
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={handleUpdateResume}
                        className="save-btn"
                        disabled={!watch("resume")}
                      >
                        {user?.resume ? "Update Resume" : "Add Resume"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(activeSection === 'current' && user?.role === 3) && (
                <div className="section-content">
                  <h3>Current Details</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      <UserProfileForm 
                        profile={userProfile} 
                        fetchProfile={fetchUserProfile} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {(activeSection === 'about' && user?.role === 3) && (
                <div className="section-content">
                  <h3>About</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      <label htmlFor="about">About Yourself</label>
                      <textarea
                        id="about"
                        name="about"
                        placeholder="Tell us about yourself, your skills, and interests"
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <div className="row full-width">
                      <label htmlFor="full_address">Full Address</label>
                      <textarea
                        id="full_address"
                        name="full_address"
                        placeholder="Enter your complete address"
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="form-actions" style={{ alignItems: 'right' }}>
                      <button
                        type="button"
                        onClick={handleSaveAbout}
                        className="save-btn"
                        disabled={!aboutText.trim() && !fullAddress.trim()}
                      >
                        Save Details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(activeSection === 'social' && user?.role === 3) && (
                <div className="section-content">
                  <h3>Social Links</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      {showCandidateSocialLinksForm ? (
                        <div className="social-links-form">
                          <div className="grid">
                            <div>
                              <label>LinkedIn</label>
                              <input
                                type="url"
                                name="linkedin"
                                value={candidateSocialLinks.linkedin || ''}
                                onChange={handleCandidateSocialLinksChange}
                                placeholder="https://linkedin.com/in/username"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>GitHub</label>
                              <input
                                type="url"
                                name="github"
                                value={candidateSocialLinks.github || ''}
                                onChange={handleCandidateSocialLinksChange}
                                placeholder="https://github.com/username"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Portfolio</label>
                              <input
                                type="url"
                                name="portfolio"
                                value={candidateSocialLinks.portfolio || ''}
                                onChange={handleCandidateSocialLinksChange}
                                placeholder="https://yourportfolio.com"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Twitter</label>
                              <input
                                type="url"
                                name="twitter"
                                value={candidateSocialLinks.twitter || ''}
                                onChange={handleCandidateSocialLinksChange}
                                placeholder="https://twitter.com/username"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>LeetCode</label>
                              <input
                                type="url"
                                name="leetcode"
                                value={candidateSocialLinks.leetcode || ''}
                                onChange={handleCandidateSocialLinksChange}
                                placeholder="https://leetcode.com/username"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Other</label>
                              <input
                                type="url"
                                name="other"
                                value={candidateSocialLinks.other || ''}
                                onChange={handleCandidateSocialLinksChange}
                                placeholder="https://example.com"
                                validatePattern="https?://.+"
                              />
                            </div>
                          </div>
                          <div className="form-actions">
                            <button
                              type="button"
                              onClick={() => setShowCandidateSocialLinksForm(false)}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveCandidateSocialLinks}
                              className="save-btn"
                            >
                              Save Links
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="social-links-display">
                          <div className="links-grid">
                            {candidateSocialLinks.linkedin && (
                              <div className="link-item">
                                <p>LinkedIn</p>
                                <a 
                                  href={candidateSocialLinks.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {candidateSocialLinks.linkedin.length > 30 
                                    ? candidateSocialLinks.linkedin.substring(0, 30) + '...' 
                                    : candidateSocialLinks.linkedin}
                                </a>
                              </div>
                            )}
                            {candidateSocialLinks.github && (
                              <div className="link-item">
                                <p>GitHub</p>
                                <a 
                                  href={candidateSocialLinks.github} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {candidateSocialLinks.github.length > 30 
                                    ? candidateSocialLinks.github.substring(0, 30) + '...' 
                                    : candidateSocialLinks.github}
                                </a>
                              </div>
                            )}
                            {candidateSocialLinks.portfolio && (
                              <div className="link-item">
                                <p>Portfolio</p>
                                <a 
                                  href={candidateSocialLinks.portfolio} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {candidateSocialLinks.portfolio.length > 30 
                                    ? candidateSocialLinks.portfolio.substring(0, 30) + '...' 
                                    : candidateSocialLinks.portfolio}
                                </a>
                              </div>
                            )}
                            {candidateSocialLinks.twitter && (
                              <div className="link-item">
                                <p>Twitter</p>
                                <a 
                                  href={candidateSocialLinks.twitter} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {candidateSocialLinks.twitter.length > 30 
                                    ? candidateSocialLinks.twitter.substring(0, 30) + '...' 
                                    : candidateSocialLinks.twitter}
                                </a>
                              </div>
                            )}
                            {candidateSocialLinks.leetcode && (
                              <div className="link-item">
                                <p>LeetCode</p>
                                <a 
                                  href={candidateSocialLinks.leetcode} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {candidateSocialLinks.leetcode.length > 30 
                                    ? candidateSocialLinks.leetcode.substring(0, 30) + '...' 
                                    : candidateSocialLinks.leetcode}
                                </a>
                              </div>
                            )}
                            {candidateSocialLinks.other && (
                              <div className="link-item">
                                <p>Other</p>
                                <a 
                                  href={candidateSocialLinks.other} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {candidateSocialLinks.other.length > 30 
                                    ? candidateSocialLinks.other.substring(0, 30) + '...' 
                                    : candidateSocialLinks.other}
                                </a>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowCandidateSocialLinksForm(true)}
                            className="edit-btn"
                          >
                            <CiSquarePlus /> {Object.keys(candidateSocialLinks).filter(k => candidateSocialLinks[k]).length ? 'Edit Links' : 'Add Social Links'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* About Section (Recruiter only) */}
              {(activeSection === 'about' && user?.role === 2) && (
                <div className="section-content">
                  <h3>About</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      <label htmlFor="about">About Yourself & Organization</label>
                      <textarea
                        id="about"
                        name="about"
                        placeholder="Tell us about yourself and your organization"
                        defaultValue={recruiterProfile?.about}
                        {...register("about")}
                      />
                    </div>
                    
                    <div className="row full-width">
                      <label htmlFor="full_address">Full Address</label>
                      <textarea
                        id="full_address"
                        name="full_address"
                        placeholder="Company/organization full address"
                        defaultValue={recruiterProfile?.full_address}
                        {...register("full_address")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Certificates Section */}
              {(activeSection === 'certificates' && (user?.role === 3)) && (
                <div className="section-content">
                  <h3>Certificates</h3>
                  <div className="certificate-list">
                    {certificates.map((cert) => (
                      <CertificateForm 
                        key={cert.id} 
                        certificate={cert} 
                        fetchCertificates={fetchCertificates} 
                      />
                    ))}
                    {showCertificateForm ? (
                      <CertificateForm 
                        fetchCertificates={fetchCertificates} 
                        onCancel={() => setShowCertificateForm(false)}
                      />
                    ) : (
                      <button 
                        className="add-btn"
                        onClick={() => setShowCertificateForm(true)}
                        type="button"
                      >
                        <CiSquarePlus /> Add Certificate
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {(activeSection === 'projects' && (user?.role === 3)) && (
                <div className="section-content">
                  <h3>Projects</h3>
                  <div className="project-list">
                    {projects.map((project) => (
                      <ProjectForm
                        key={project.id}
                        project={project}
                        fetchProjects={fetchProjects}
                      />
                    ))}
                    {showProjectForm ? (
                      <ProjectForm
                        fetchProjects={fetchProjects}
                        onCancel={() => setShowProjectForm(false)}
                      />
                    ) : (
                      <button
                        className="add-btn"
                        onClick={() => setShowProjectForm(true)}
                        type="button"
                      >
                        <CiSquarePlus /> Add Project
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {(activeSection === 'education' && (user?.role === 3 || user?.role === 2)) && (
                <div className="section-content">
                  <h3>Education Details</h3>
                  <div className="education-list">
                    {education.map((edu) => (
                      <EducationForm 
                        key={edu.id} 
                        education={edu} 
                        fetchEducation={fetchEducation} 
                      />
                    ))}
                    {showEducationForm ? (
                      <EducationForm 
                        fetchEducation={fetchEducation} 
                        onCancel={() => setShowEducationForm(false)}
                      />
                    ) : (
                      <button 
                        className="add-btn"
                        onClick={() => setShowEducationForm(true)}
                        type="button"
                      >
                        <CiSquarePlus /> Add Education
                      </button>
                    )}
                  </div>
                </div>
              )}

              {(activeSection === 'skills' && (user?.role === 3 || user?.role === 2)) && (
                <div className="section-content">
                  <h3>Skills</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      <SkillsAutocomplete 
                        value={skills}
                        onChange={setSkills}
                        placeholder="Search and add your skills..."
                        showSuggestionsSection={true}
                      />
                      {skills.length >= 20 && (
                        <p className="text-sm text-red-500 mt-2">
                          You've reached the maximum of 20 skills
                        </p>
                      )}
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={handleSaveSkills}
                        className="save-btn"
                        disabled={skills.length === 0 || skills.length > 20}
                      >
                        Save Skills
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Work Experience Section */}
              {(activeSection === 'experience' && (user?.role === 3 || user?.role === 2)) && (
                <div className="section-content">
                  <h3>Work Experience</h3>
                  <div className="experience-list">
                    {workExperiences.map(exp => (
                      <WorkExperienceForm 
                        key={exp.id} 
                        experience={exp} 
                        fetchExperiences={fetchWorkExperiences} 
                      />
                    ))}
                    {showWorkExperienceForm ? (
                      <WorkExperienceForm 
                        fetchExperiences={fetchWorkExperiences} 
                        onCancel={() => setShowWorkExperienceForm(false)}
                      />
                    ) : (
                      <button 
                        className="add-btn"
                        onClick={() => setShowWorkExperienceForm(true)}
                        type="button"
                      >
                        <CiSquarePlus /> Add Experience
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links Section (Recruiter only) */}
              {(activeSection === 'social' && user?.role === 2) && (
                <div className="section-content">
                  <h3>Social Links</h3>
                  <div className="form-grid">
                    <div className="row full-width">
                      {showSocialLinksForm ? (
                        <div className="social-links-form">
                          <div className="grid">
                            <div>
                              <label>LinkedIn</label>
                              <input
                                type="url"
                                name="linkedin"
                                value={socialLinks.linkedin || ''}
                                onChange={handleSocialLinksChange}
                                placeholder="https://linkedin.com/in/username"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>GitHub</label>
                              <input
                                type="url"
                                name="github"
                                value={socialLinks.github || ''}
                                onChange={handleSocialLinksChange}
                                placeholder="https://github.com/username"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Twitter</label>
                              <input
                                type="url"
                                name="twitter"
                                value={socialLinks.twitter || ''}
                                onChange={handleSocialLinksChange}
                                placeholder="https://twitter.com/username"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Website</label>
                              <input
                                type="url"
                                name="website"
                                value={socialLinks.website || ''}
                                onChange={handleSocialLinksChange}
                                placeholder="https://yourwebsite.com"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Instagram</label>
                              <input
                                type="url"
                                name="instagram"
                                value={socialLinks.instagram || ''}
                                onChange={handleSocialLinksChange}
                                placeholder="https://instagram.com/username"
                                validatePattern="https?://.+"
                              />
                            </div>
                            <div>
                              <label>Other</label>
                              <input
                                type="url"
                                name="other"
                                value={socialLinks.other || ''}
                                onChange={handleSocialLinksChange}
                                placeholder="https://example.com"
                                validatePattern="https?://.+"
                              />
                            </div>
                          </div>
                          <div className="form-actions">
                            <button
                              type="button"
                              onClick={() => setShowSocialLinksForm(false)}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveSocialLinks}
                              className="save-btn"
                            >
                              Save Links
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="social-links-display">
                          <div className="links-grid">
                            {socialLinks.linkedin && (
                              <div className="link-item">
                                <p>LinkedIn</p>
                                <a 
                                  href={socialLinks.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.linkedin.length > 30 
                                    ? socialLinks.linkedin.substring(0, 30) + '...' 
                                    : socialLinks.linkedin}
                                </a>
                              </div>
                            )}
                            {socialLinks.github && (
                              <div className="link-item">
                                <p>GitHub</p>
                                <a 
                                  href={socialLinks.github} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.github.length > 30 
                                    ? socialLinks.github.substring(0, 30) + '...' 
                                    : socialLinks.github}
                                </a>
                              </div>
                            )}
                            {socialLinks.twitter && (
                              <div className="link-item">
                                <p>Twitter</p>
                                <a 
                                  href={socialLinks.twitter} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.twitter.length > 30 
                                    ? socialLinks.twitter.substring(0, 30) + '...' 
                                    : socialLinks.twitter}
                                </a>
                              </div>
                            )}
                            {socialLinks.website && (
                              <div className="link-item">
                                <p>Website</p>
                                <a 
                                  href={socialLinks.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.website.length > 30 
                                    ? socialLinks.website.substring(0, 30) + '...' 
                                    : socialLinks.website}
                                </a>
                              </div>
                            )}
                            {socialLinks.instagram && (
                              <div className="link-item">
                                <p>Instagram</p>
                                <a 
                                  href={socialLinks.instagram} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.instagram.length > 30 
                                    ? socialLinks.instagram.substring(0, 30) + '...' 
                                    : socialLinks.instagram}
                                </a>
                              </div>
                            )}
                            {socialLinks.other && (
                              <div className="link-item">
                                <p>Other</p>
                                <a 
                                  href={socialLinks.other} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {socialLinks.other.length > 30 
                                    ? socialLinks.other.substring(0, 30) + '...' 
                                    : socialLinks.other}
                                </a>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleAddSocialLink}
                            className="edit-btn"
                          >
                            <CiSquarePlus /> {Object.keys(socialLinks).filter(k => socialLinks[k]).length ? 'Edit Links' : 'Add Social Links'}
                          </button>
                          <input
                            type="hidden"
                            {...register("social_links")}
                            value={JSON.stringify(socialLinks)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <input
                  type="submit"
                  value="Update Profile"
                  className="submit-btn"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  /* Base reset to prevent any overflow */
  * {
    box-sizing: border-box;
    max-width: 100%;
  }

  .profile-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 15px 20px;
    width: 100%;
  }

  /* Mobile Tabbar Styles - Fixed to only scroll horizontally within the tabbar */
  .mobile-tabbar {
    width: 100%;
    margin-bottom: 1rem;
    background: white;
    padding: 8px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    overflow: hidden;
    position: relative;
    margin-left: 10px;
    left: 0;
    right: 0;
  }

  .tabbar-scroll {
    display: flex;
    gap: 0.5rem;
    padding: 0 0px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
  }

  /* Hide scrollbar for webkit browsers */
  .tabbar-scroll::-webkit-scrollbar {
    display: none;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    font-size: 0.8rem;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

    .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f7fafc;
    border: none;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: #ebf8ff;
    color: #414BEA;
  }

  /* Phone Input Styles */
  .phone-input-container {
    width: 100%;
    font-family: inherit;
    position: relative;
  }

  .phone-input-wrapper {
    position: relative;
    width: 100%;
  }

  .phone-input-wrapper .verified-badge,
  .phone-input-wrapper .verify-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .phone-input-field {
    width: 100% !important;
    height: 42px !important;
    padding-left: 62px !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 6px !important;
    font-size: 0.875rem !important;
    transition: all 0.2s ease;
    margin-left: 1px !important;
  }

  .phone-input-field:focus {
    border-color: #414BEA !important;
    box-shadow: 0 0 0 1px #414BEA !important;
    outline: none !important;
  }

  .phone-input-button {
    background: #f7fafc !important;
    border-right: 1px solid #e2e8f0 !important;
    border-radius: 6px 0 0 6px !important;
    padding: 0 8px 0 12px !important;
  }

  .phone-input-dropdown {
    width: 300px !important;
    max-width: 100vw !important;
    font-family: inherit !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
    border-radius: 6px !important;
    margin-top: 4px !important;
    z-index: 1000 !important;
  }

  .phone-input-search {
    padding: 12px !important;
    font-size: 0.875rem !important;
    border-bottom: 1px solid #e2e8f0 !important;
    margin-bottom: 4px !important;
  }

  .phone-input-dropdown .country {
    padding: 8px 12px !important;
    font-size: 0.875rem !important;
  }

  .phone-input-dropdown .country:hover {
    background-color: #f7fafc !important;
  }

  .phone-input-dropdown .country.highlight {
    background-color: #ebf8ff !important;
  }

  .phone-input-dropdown .country-name {
    margin-left: 8px !important;
  }

  .phone-input-dropdown .dial-code {
    color: #718096 !important;
    margin-left: 4px !important;
  }

  @media (max-width: 768px) {
    .phone-input-dropdown {
      width: calc(100vw - 32px) !important;
      left: 0 !important;
      transform: none !important;
    }

    .phone-input-field {
      height: 48px !important;
      font-size: 16px !important;
      margin-left: 1px;
    }

    .phone-input-dropdown .country {
      padding: 10px 12px !important;
    }
  }

  .progress-container {
    margin-bottom: 2rem;
    width: 100%;
    margin-top: -20px;
  }

  .tab.active {
    background-color: #ebf8ff;
    color: #414BEA;
    border-color: #414BEA;
  }

  .tab.complete .icon {
    color: #38a169;
  }

  .tab .icon {
    font-size: 0.9rem;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    width: 100%;
    margin-top: 10px;
  }

  .title-row h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background-color: #414BEA;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #4a5568;
    font-weight: 500;
  }

  .profile-layout {
    display: flex;
    width: 100%;
  }

  .sidebar {
    width: 250px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 10px 0px rgba(30, 10, 58, .04);
    padding: 1.5rem;
    height: fit-content;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar li {
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: #4a5568;
    transition: all 0.2s ease;
  }

  .sidebar li:hover {
    background-color: #ebf8ff;
    color: #414BEA;
  }

  .sidebar li.active {
    background-color: #ebf8ff;
    color: #414BEA;
    font-weight: 500;
  }

  .sidebar .icon {
    margin-right: 0.75rem;
    font-size: 1rem;
  }

  .sidebar .icon.complete {
    color: #38a169;
  }

  .content {
    flex-grow: 1;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 10px 0px rgba(30, 10, 58, .04);
    padding: 2rem;
  }

  .section-content {
    margin-bottom: 2rem;
    width: 100%;
  }

  .section-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  .row {
    margin-bottom: 1rem;
    width: 100%;
  }

  .row.full-width {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #414BEA;
    box-shadow: 0 0 0 1px #414BEA;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  .phone-input {
    display: flex;
    align-items: center;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    width: 100%;
  }

  .phone-input .prefix {
    padding: 0.75rem;
    background-color: #f7fafc;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
    border-right: 1px solid #e2e8f0;
  }

  .phone-input input {
    border: none;
    padding-left: 0.75rem;
  }

  .error-message {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #F05537;
  }

  .help-text {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #718096;
  }

  .education-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .certificate-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .project-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #414BEA;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    margin: 1rem auto;
    transition: background-color 0.2s;
    width: 100%;
    max-width: 200px;
  }

  .add-btn:hover {
    background-color: #2c5282;
  }

  .suggested-skills-section {
    margin-top: 1rem;
  }

  .suggested-skills-section h4 {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .suggested-skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .suggested-skill-tag {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 0.3rem 0.8rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .suggested-skill-tag:hover {
    background-color: #e0e0e0;
  }

  .skills-autocomplete {
    width: 100%;
    margin-top: 6px;
  }
  
  .skills-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
    min-height: 20px;
    width: 100%;
  }
  
  .skill-tag {
    background-color: var(--color-primary, #7752FE);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .remove-skill {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    padding: 0;
    margin-left: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
  
  .remove-skill:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .input-container {
    position: relative;
    width: 100%;
  }
  
  .skills-input {
    width: 100%;
    padding: 8px 14px;
    border: 1px solid #0000004a;
    border-radius: 4px;
    font-size: calc(0.8rem + 0.1vw);
    outline: none;
    color: var(--color-black);
  }
  
  .skills-input:focus {
    outline: none;
    border: 1px solid #00000086;
  }
  
  .suggestions-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #0000004a;
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 6px 10px 0px rgba(30, 10, 58, .04);
    width: 100%;
  }
  
  .suggestion-item {
    padding: 8px 14px;
    cursor: pointer;
    font-size: calc(0.8rem + 0.1vw);
    color: var(--color-black);
    transition: background-color 0.2s;
  }
  
  .suggestion-item:hover {
    background-color: #f0f0f0;
  }

  .social-links-form {
    width: 100%;
    padding: 1.5rem;
    background-color: #f7fafc;
    border-radius: 8px;
  }

  .social-links-form .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .social-links-display {
    width: 100%;
    padding: 1.5rem;
    background-color: #f7fafc;
    border-radius: 8px;
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .link-item p {
    font-size: 0.75rem;
    color: #718096;
    margin-bottom: 0.25rem;
  }

  .link-item a {
    font-size: 0.875rem;
    color: #414BEA;
    text-decoration: none;
    word-break: break-all;
  }

  .link-item a:hover {
    text-decoration: underline;
  }

  .save-btn {
    padding: 0.75rem 1rem;
    background-color: #414BEA;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .edit-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #414BEA;
    background: none;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 0;
  }

  .edit-btn:hover {
    color: #2c5282;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    width: 100%;
  }

  .submit-btn {
    padding: 0.75rem 2rem;
    background-color: #414BEA;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-btn:hover {
    background-color: #414BEA;
  }

  .cancel-btn {
    padding: 0.5rem 1rem;
    background-color: #fff;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-right: 1rem;
  }

  .cancel-btn:hover {
    background-color: #f7fafc;
  }

  .verification-status {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .verified-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #38a169;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .verify-btn {
    background: none;
    border: none;
    color: #414BEA;
    font-size: 0.75rem;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }

  .verify-btn:disabled {
    color: #a0aec0;
    text-decoration: none;
    cursor: not-allowed;
  }

  .otp-container {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .otp-container input {
    flex: 1;
    max-width: 120px;
    padding: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
  }

  .verify-otp-btn {
    padding: 8px 12px;
    background-color: #414BEA;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 6px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .verify-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .email-field {
    position: relative;
  }

  .email-field .verified-badge,
  .email-field .not-verified {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
  }

  .email-field .not-verified {
    color: #e53e3e;
  }

  /* Strict mobile view changes to prevent horizontal scroll */
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: hidden;
    
    .profile-container {
      padding-bottom: 60px;
      width: 100%;
    }
    
    .profile-layout {
      flex-direction: column;
      width: 100%;
    }

    .sidebar {
      width: 100%;
      margin-bottom: 1.5rem;
      padding: 1rem;
    }

    .content {
      padding: 1rem;
      width: 100%;
      box-shadow: 0 6px 10px 0px rgba(30, 10, 58, .04);
      margin-top: -12px;
    }

    .form-grid {
      grid-template-columns: 1fr;
      width: 100%;
    }

    .mobile-tabbar {
      width: 88vw;
      position: relative;
      left: 50%;
      right: 50%;
      margin-top: -25px;
      margin-left: -44vw;
      margin-right: -50vw;
    }

    .tabbar-scroll {
      padding: 0 0px;
    }

    .social-links-form,
    .social-links-display {
      padding: 1rem;
      width: 100%;
    }

    input, select, textarea {
      width: 100%;
    }

    /* Ensure no element can cause overflow */
    body, html, #root, .App {
      overflow-x: hidden;
      width: 100%;
    }

    /* Remove any potential margin/padding causing overflow */
    body {
      margin: 0;
      padding: 0;
    }
  }
`;

export default EditProfile;