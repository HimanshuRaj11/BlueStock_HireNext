import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import LoadingComTwo from "./shared/LoadingComTwo";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const userTypes = [
  { id: 1, name: "College Student" },
  { id: 2, name: "Professional" },
  { id: 3, name: "School Student" },
  { id: 4, name: "Fresher" }
];

const purposes = [
  { id: 1, name: "Find Job" },
  { id: 2, name: "Upskill" },
  { id: 3, name: "Mentor" },
  { id: 4, name: "Event" }
];

  const CollegeAutocomplete = ({ value, onChange }) => {
    const [colleges, setColleges] = useState([]);
    const [allColleges, setAllColleges] = useState([]);
    const [inputValue, setInputValue] = useState(value || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customCollegeName, setCustomCollegeName] = useState("");
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const customInputRef = useRef(null);
    const isInteracting = useRef(false);

    useEffect(() => {
      setIsLoading(true);
      fetch('/data/colleges.json')
        .then(response => response.json())
        .then(data => {
          setAllColleges(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading colleges:', error);
          setIsLoading(false);
        });
    }, []);

    useEffect(() => {
      if (!isDropdownOpen || !isInteracting.current) return;
      
      const timer = setTimeout(() => {
        if (inputValue.length > 2 && allColleges.length > 0) {
          const searchTerm = inputValue.toLowerCase();
          const filtered = [];
          
          for (let i = 0; i < allColleges.length && filtered.length < 8; i++) {
            if (allColleges[i].name.toLowerCase().includes(searchTerm)) {
              filtered.push(allColleges[i]);
            }
          }
          
          setColleges(filtered);
        } else {
          setColleges([]);
        }
      }, 50);

      return () => clearTimeout(timer);
    }, [inputValue, isDropdownOpen, allColleges]);

    const handleInputChange = (e) => {
      isInteracting.current = true;
      const value = e.target.value;
      setInputValue(value);
      if (value.length > 2) {
        setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
      }
      if (value === "") {
        onChange("");
      }
    };

    const handleInputFocus = () => {
      isInteracting.current = true;
      if (inputValue.length > 2) {
        setIsDropdownOpen(true);
      }
    };

    const handleInputBlur = useCallback(() => {
      isInteracting.current = false;
      setTimeout(() => {
        if (!dropdownRef.current?.contains(document.activeElement)) {
          setIsDropdownOpen(false);
        }
      }, 200);
    }, []);

    const handleSelect = (college) => {
      if (college === "others") {
        setShowCustomInput(true);
        setIsDropdownOpen(false);
        setTimeout(() => customInputRef.current?.focus(), 0);
      } else {
        onChange(college.name);
        setInputValue(college.name);
        setIsDropdownOpen(false);
        inputRef.current?.blur();
      }
    };

    const handleCustomCollegeSubmit = () => {
      if (customCollegeName.trim()) {
        onChange(customCollegeName);
        setInputValue(customCollegeName);
        setShowCustomInput(false);
        setCustomCollegeName("");
      }
    };

    return (
      <div className="college-autocomplete" ref={dropdownRef}>
        {showCustomInput ? (
          <div className="custom-college-input-container">
            <input
              ref={customInputRef}
              type="text"
              value={customCollegeName}
              onChange={(e) => setCustomCollegeName(e.target.value)}
              placeholder="Enter your college name"
              className="college-input"
              onKeyDown={(e) => e.key === "Enter" && handleCustomCollegeSubmit()}
              onBlur={handleInputBlur}
            />
            <div className="custom-college-buttons">
              <button 
                type="button"
                onClick={handleCustomCollegeSubmit}
                className="save-custom-college"
              >
                Save
              </button>
              <button 
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="cancel-custom-college"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Type to search colleges..."
            className="college-input"
          />
        )}
        {isLoading && <div className="loading-text">Loading colleges...</div>}
        {isDropdownOpen && (
          <div className="college-dropdown">
            <div
              className="college-item others-option"
              onClick={() => handleSelect("others")}
            >
              Others (Not in list)
            </div>
            
            {colleges.map((college, index) => (
              <div
                key={index}
                className="college-item"
                onClick={() => handleSelect(college)}
              >
                {college.name}
              </div>
            ))}
            
            {inputValue.length > 2 && colleges.length === 0 && (
              <div className="college-item no-results">
                No colleges found. Select "Others" above to enter manually.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

const UserProfileForm = ({ profile, fetchProfile }) => {
  const { user } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_type: 1,
    course_name: "",
    specialization: "",
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear(),
    designation: "",
    work_experience: "",
    currently_working: false, // Changed from currently_working
    purposes: [],
    college_org_name: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        user_type: profile.user_type || 1,
        course_name: profile.course_name || "",
        specialization: profile.specialization || "",
        start_year: profile.start_year || new Date().getFullYear(),
        end_year: profile.end_year || null,
        designation: profile.designation || "",
        work_experience: profile.work_experience || "",
        currently_working: profile.currently_working || false, // Changed from currently_working
        purposes: profile.purposes || [],
        college_org_name: profile.college_org_name || ""
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'user_type') {
      const newUserType = Number(value);
      setFormData(prev => {
        const newData = {
          ...prev,
          user_type: newUserType
        };
        
        if (newUserType === 2) {
          newData.course_name = "";
          newData.specialization = "";
          newData.designation = "";
          newData.work_experience = "";
        } else if ([1, 3, 4].includes(newUserType)) {
          newData.designation = "";
          newData.work_experience = "";
        }
        
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePurposeChange = (purposeId) => {
    setFormData(prev => {
      const newPurposes = prev.purposes.includes(purposeId)
        ? prev.purposes.filter(id => id !== purposeId)
        : [...prev.purposes, purposeId];
      
      return {
        ...prev,
        purposes: newPurposes
      };
    });
  };

  const showAlert = (message, type = 'error') => {
    const options = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      case 'error':
      default:
        toast.error(message, options);
        break;
    }
  };

  const validateForm = () => {
    if (!formData.college_org_name.trim()) {
      showAlert("College/Organization Name is required", 'error');
      return false;
    }

    if (formData.purposes.length === 0) {
      showAlert("At least one purpose is required", 'error');
      return false;
    }

    if ([1, 3, 4].includes(Number(formData.user_type))) {
      if (!formData.course_name.trim()) {
        showAlert("Course name is required", 'error');
        return false;
      }
      if (!formData.specialization.trim()) {
        showAlert("Specialization is required", 'error');
        return false;
      }
    }

    if (Number(formData.user_type) === 2) {
      if (!formData.designation.trim()) {
        showAlert("Designation is required", 'error');
        return false;
      }
      if (isNaN(parseFloat(formData.work_experience))) {
        showAlert("Valid work experience is required", 'error');
        return false;
      }
    }

    // Common validation for all user types
    if (!formData.currently_working && 
        Number(formData.start_year) > Number(formData.end_year)) {
      showAlert("End year must be after start year", 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
      const toastId = toast.loading("Updating profile...", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false
      });

      e.preventDefault();
      setLoading(true);

      if (!validateForm()) {
        setLoading(false);
        toast.dismiss(toastId);
        return;
      }

      const payload = {
        user_type: Number(formData.user_type),
        course_name: [1, 3, 4].includes(Number(formData.user_type)) ? formData.course_name.trim() : null,
        specialization: [1, 3, 4].includes(Number(formData.user_type)) ? formData.specialization.trim() : null,
        start_year: Number(formData.start_year),
        end_year: formData.currently_ongoing ? null : Number(formData.end_year),
        designation: formData.user_type === 2 ? formData.designation.trim() : null,
        work_experience: formData.user_type === 2 ? 
          (formData.work_experience ? parseFloat(formData.work_experience) : 0) : 
          null,
        currently_working: formData.currently_working || false,
        purposes: formData.purposes.map(Number),
        college_org_name: formData.college_org_name.trim()
      };

      try {
        const API_BASE_URL = 'http://localhost:3000';
        
        if (profile) {
          await axios.patch(`${API_BASE_URL}/api/user-profile`, payload, { withCredentials: true });
          toast.update(toastId, {
            render: "Profile updated successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
            draggable: true
          });
        } else {
          await axios.post(`${API_BASE_URL}/api/user-profile`, payload, { withCredentials: true });
          toast.update(toastId, {
            render: "Profile created successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
            draggable: true
          });
        }

        await fetchProfile();
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save profile:', error);
        toast.update(toastId, {
          render: `Failed: ${error.response?.data?.message || error.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
          draggable: true
        });
      } finally {
        setLoading(false);
      }
  };

  if (!isEditing && profile) {
    return (
      <ProfileCard>
        <h3>User Profile</h3>
        <ProfileField>
          <strong>User Type:</strong> {userTypes.find(ut => ut.id === profile.user_type)?.name}
        </ProfileField>
        <ProfileField>
          <strong>College/Organization:</strong> {profile.college_org_name}
        </ProfileField>
        
        {[1, 3, 4].includes(profile.user_type) && (
          <>
            <ProfileField>
              <strong>Course:</strong> {profile.course_name}
            </ProfileField>
            <ProfileField>
              <strong>Specialization:</strong> {profile.specialization}
            </ProfileField>
          </>
        )}
        
        {profile.user_type === 2 && (
          <>
            <ProfileField>
              <strong>Designation:</strong> {profile.designation}
            </ProfileField>
            <ProfileField>
              <strong>Work Experience:</strong> {profile.work_experience} years
            </ProfileField>
          </>
        )}

        <ProfileField>
          <strong>Period:</strong> {profile.start_year} - 
          {profile.currently_working ? ' Present' : ` ${profile.end_year}`}
        </ProfileField>
        
        <ProfileField>
          <strong>Purposes:</strong> {profile.purposes.map(p => 
            purposes.find(pur => pur.id === p)?.name).join(', ')}
        </ProfileField>
        
        <Actions>
          <button onClick={() => setIsEditing(true)}>
            <ion-icon name="create-outline"></ion-icon> Edit
          </button>
        </Actions>
      </ProfileCard>
    );
  }

  return (
    <FormWrapper onSubmit={handleSubmit} onClick={(e) => {
      const isCollegeInput = e.target.closest('.college-autocomplete');
      if (!isCollegeInput) {
        isInteracting.current = false;
      }
    }}>        
      <div className="form-section">
        <h3>Basic Information</h3>
        
        <div className="form-row">
          <label>User Type*</label>
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            required
          >
            {userTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <label>College/Organization Name*</label>
          <CollegeAutocomplete
            value={formData.college_org_name}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              college_org_name: value
            }))}
          />
        </div>
        
        <div className="form-row">
          <label>Purposes*</label>
          <div className="purpose-tags">
            {purposes.map(purpose => (
              <span
                key={purpose.id}
                className={`purpose-tag ${formData.purposes.includes(purpose.id) ? 'selected' : ''}`}
                onClick={() => handlePurposeChange(purpose.id)}
              >
                {purpose.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {[1, 3, 4].includes(Number(formData.user_type)) && (
        <div className="form-section">
          <h3>Education Details</h3>
          
          <div className="form-row">
            <label>Course Name*</label>
            <input
              type="text"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <label>Specialization*</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <label>Start Year*</label>
            <input
              type="number"
              name="start_year"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.start_year}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      )}
      
      {Number(formData.user_type) === 2 && (
        <div className="form-section">
          <h3>Professional Details</h3>
          
          <div className="form-row">
            <label>Designation*</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <label>Work Experience (years)*</label>
            <input
              type="number"
              name="work_experience"
              step="0.1"
              min="0"
              max="50"
              value={formData.work_experience}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <label>Start Year*</label>
            <input
              type="number"
              name="start_year"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.start_year}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      )}
      
      {/* Common Currently Ongoing checkbox for all user types */}
      <div className="form-row">
        <label>
          <input
            type="checkbox"
            name="currently_working"
            checked={formData.currently_working}
            onChange={handleChange}
          />
          Currently Ongoing
        </label>
      </div>
      
      {!formData.currently_working && (
        <div className="form-row">
          <label>End Year*</label>
          <input
            type="number"
            name="end_year"
            min={formData.start_year}
            max="2500"
            value={formData.end_year}
            onChange={handleChange}
            required
          />
        </div>
      )}
      
      <div className="button-row">
        <button type="submit" onClick={handleSubmit} className="save-btn">Save Profile</button>
        {profile && (
          <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        )}
      </div>
    </FormWrapper>
  );
};

const ProfileCard = styled.div`
  border: 1px solid #ddd;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
    
    h3 {
      font-size: 1.1rem;
    }
  }
`;

const ProfileField = styled.div`
  margin: 0.75rem 0;
  font-size: 0.95rem;
  line-height: 1.5;

  strong {
    color: #555;
    margin-right: 0.5rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }
`;

const Actions = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;

  button {
    background: #414BEA;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: background-color 0.2s;

    &:hover {
      background: #2c5282;
    }

    ion-icon {
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    
    button {
      padding: 0.5rem 0.8rem;
      font-size: 0.85rem;
    }
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }

  .purpose-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .purpose-tag {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #555;
    text-align: center;
    flex: 1 0 calc(50% - 0.75rem); /* Two items per row on mobile */

    &:hover {
      border-color: #414BEA;
      color: #414BEA;
    }

    &.selected {
      background-color: #414BEA;
      color: white;
      border-color: #414BEA;
    }

    @media (min-width: 769px) {
      flex: none; /* Reset flex for desktop */
      min-width: 100px; /* Fixed width for desktop */
    }
  }

  .college-autocomplete {
    position: relative;
  }

  .college-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      max-height: 150px;
    }
  }

  .custom-college-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .custom-college-buttons {
    display: flex;
    gap: 0.5rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .custom-college-buttons button {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;

    @media (max-width: 768px) {
      padding: 0.6rem;
      font-size: 0.9rem;
    }
  }

  .save-custom-college {
    background-color: #414BEA;
    color: white;
  }

  .save-custom-college:hover {
    background-color: #2c5282;
  }

  .cancel-custom-college {
    background-color: #e53e3e;
    color: white;
  }

  .cancel-custom-college:hover {
    background-color: #c53030;
  }

    .others-option {
        color: #414BEA;
        font-weight: 500;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .no-results {
        color: #666;
        font-style: italic;
        font-size: 0.85rem;
        padding: 0.75rem;
        cursor: default;
    }

  .college-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;

    @media (max-width: 768px) {
      padding: 0.8rem;
    }
  }

  .college-item {
    padding: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f7ff;
    }

    @media (max-width: 768px) {
      padding: 0.8rem;
      font-size: 0.9rem;
    }
  }

  .loading-text {
    padding: 0.5rem;
    color: #666;
    font-size: 0.8rem;
  }

  .form-section {
    h3 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;

      @media (max-width: 768px) {
        font-size: 1rem;
        margin-bottom: 0.8rem;
      }
    }
  }

  .form-row {
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      margin-bottom: 0.8rem;
    }

    label {
      display: block;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;

      @media (max-width: 768px) {
        font-size: 0.9rem;
        margin-bottom: 0.4rem;
      }
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #414BEA;
      }

      @media (max-width: 768px) {
        padding: 0.8rem;
        font-size: 0.95rem;
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  }

  .date-inputs {
    display: flex;
    gap: 0.5rem;
    
    select {
      flex: 2;
    }
    
    input {
      flex: 1;
    }

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0.5rem;
      
      select, input {
        width: 100%;
      }
    }
  }

  .purpose-checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;

    @media (max-width: 768px) {
      gap: 0.8rem;
    }

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .purpose-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;

    input {
      width: auto;
      margin: 0;
    }

    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
  }

  .button-row {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
      flex-direction: column-reverse;
      gap: 0.8rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      @media (max-width: 768px) {
        width: 100%;
        padding: 0.9rem;
        font-size: 1rem;
      }
    }

    .save-btn {
      background-color: #414BEA;
      color: white;

      &:hover {
        background-color: #2c5282;
      }
    }

    .cancel-btn {
      background-color: #e53e3e;
      color: white;

      &:hover {
        background-color: #c53030;
      }
    }
  }
`;

export {  UserProfileForm };