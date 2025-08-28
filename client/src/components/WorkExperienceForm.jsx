import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import LoadingComTwo from "./shared/LoadingComTwo";
import { Chip, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Swal from 'sweetalert2';
import { ToastContainer , toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchSkillsByIds, fetchSkillsByName } from "../utils/skillsHelper";

const employmentTypes = [
  { id: 1, name: "Full-time" },
  { id: 2, name: "Part-time" },
  { id: 3, name: "Internship" },
  { id: 4, name: "Freelance" }
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Skills Autocomplete Component
const SkillsAutocomplete = ({ value, onChange, placeholder = "Type to search skills..." }) => {
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load current skill names when IDs change
  useEffect(() => {
    const loadCurrentSkills = async () => {
      if (value?.length > 0) {
        setLoading(true);
        setError(null);
        try {
          const skills = await fetchSkillsByIds(value);
          setCurrentSkills(skills);
        } catch (err) {
          setError('Failed to load current skills');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentSkills([]);
      }
    };
    loadCurrentSkills();
  }, [value]);

  // Search for skills when input changes
  useEffect(() => {
    if (inputValue.length > 1) {
      const timer = setTimeout(async () => {
        try {
          const skills = await fetchSkillsByName(inputValue);
          setFilteredSkills(skills);
          setShowSuggestions(skills.length > 0);
          setError(null);
        } catch (err) {
          setError('Failed to search skills');
          console.error(err);
          setFilteredSkills([]);
          setShowSuggestions(false);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setFilteredSkills([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const handleAddSkill = (skill) => {
    if (!value.includes(skill.id)) {
      onChange([...value, skill.id]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skillId) => {
    onChange(value.filter(id => id !== skillId));
  };

  return (
    <div className="skills-autocomplete">
      {/* Display current skills as tags */}
      <div className="skills-tags">
        {loading && <span>Loading skills...</span>}
        {error && <span className="error">{error}</span>}
        {currentSkills.map(skill => (
          <span key={skill.id} className="skill-tag">
            {skill.name}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill.id)}
              className="remove-skill"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Search input */}
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="skills-input"
          onFocus={() => inputValue && setShowSuggestions(filteredSkills.length > 0)}
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && (
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
    </div>
  );
};

const WorkExperienceForm = ({ experience, fetchExperiences }) => {
  const { user } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    designation: "",
    employment_type: 1,
    location: "",
    start_month: 1,
    start_year: new Date().getFullYear(),
    end_month: 1,
    end_year: new Date().getFullYear(),
    currently_working: false,
    skills: [],
    description: ""
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        company_name: experience.company_name || "",
        designation: experience.designation || "",
        employment_type: experience.employment_type || 1,
        location: experience.location || "",
        start_month: experience.start_month || 1,
        start_year: experience.start_year || new Date().getFullYear(),
        end_month: experience.end_month || 1,
        end_year: experience.end_year || new Date().getFullYear(),
        currently_working: experience.currently_working || false,
        skills: experience.skills || [],
        description: experience.description || ""
      });
    }
  }, [experience]);

  const handleSkillsChange = (newSkills) => {
    setFormData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const showAlert = (title, message, type = 'error') => {
    const ToastComponent = (
        <div>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{title}</div>
        <div>{message}</div>
        </div>
    );

    const options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    };

    switch (type) {
        case 'success':
        toast.success(ToastComponent, options);
        break;
        case 'warning':
        toast.warning(ToastComponent, options);
        break;
        case 'info':
        toast.info(ToastComponent, options);
        break;
        default: // error
        toast.error(ToastComponent, options);
    }
  };

  const handleSubmit = async (e) => {
    const toastId = toast.loading("Saving work experience...", {
      position: "top-right"
    });
    e.preventDefault();
    setLoading(true);

    if (!formData.location.trim()) {
      toast.update(toastId, {
        render: "Location is required",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }

    if (!formData.company_name.trim()) {
      toast.update(toastId, {
        render: "Company name is required",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }

    if (!formData.designation.trim()) {
      toast.update(toastId, {
        render: "Designation is required",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }

    const processedSkills = Array.isArray(formData.skills) 
      ? formData.skills
          .map(skill => {
            // Convert string numbers to actual numbers
            if (typeof skill === 'string' && !isNaN(skill)) {
              return parseInt(skill, 10);
            }
            return skill;
          })
          .filter(skill => Number.isInteger(skill) && skill > 0)
      : [];

    const payload = {
      company_name: formData.company_name.trim(),
      designation: formData.designation.trim(),
      employment_type: Number(formData.employment_type),
      location: formData.location.trim(),
      start_month: Number(formData.start_month),
      start_year: Number(formData.start_year),
      end_month: formData.currently_working ? null : Number(formData.end_month),
      end_year: formData.currently_working ? null : Number(formData.end_year),
      currently_working: formData.currently_working,
      skills: processedSkills,
      description: formData.description.trim()
    };

    try {
      const API_BASE_URL = 'http://localhost:3000';
      
      if (experience && experience.id) {
        await axios.patch(
          `${API_BASE_URL}/api/work-experience/${experience.id}`,
          payload,
          { withCredentials: true }
        );
        toast.update(toastId, {
          render: "Work experience updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/api/work-experience`,
          payload,
          { withCredentials: true }
        );
        toast.update(toastId, {
          render: "Work experience added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      await fetchExperiences();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', {
        error: error.response?.data || error.message,
        requestPayload: payload,
        config: error.config
      });
      showAlert(`Failed to save: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.delete(
          `http://localhost:3000/api/work-experience/${experience.id}`,
          { withCredentials: true }
        );
        await fetchExperiences();
        toast.success("Work experience deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error(`Failed to delete: ${error.response?.data?.message || error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isEditing && experience) {
    return (
      <ExperienceCard>
        <h4>{experience.designation}</h4>
        <p>{experience.company_name} ({employmentTypes.find(et => et.id === experience.employment_type)?.name})</p>
        <p>{experience.location}</p>
        <p>
          {months[experience.start_month - 1]} {experience.start_year} - 
          {experience.currently_working 
            ? ' Present' 
            : ` ${months[experience.end_month - 1]} ${experience.end_year}`
          }
        </p>
        {experience.description && <p>{experience.description}</p>}
        <Actions>
          <button onClick={() => setIsEditing(true)}>
            <ion-icon name="create-outline"></ion-icon>
          </button>
          <button onClick={handleDelete}>
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </Actions>
      </ExperienceCard>
    );
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Company Name*</label>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />
      </div>
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
        <label>Employment Type*</label>
        <select
          name="employment_type"
          value={formData.employment_type}
          onChange={handleChange}
          required
        >
          {employmentTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label>Location*</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Start Date*</label>
        <div className="date-inputs">
          <select
            name="start_month"
            value={formData.start_month}
            onChange={handleChange}
            required
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
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
      <div className="form-row">
        <label>
          <input
            type="checkbox"
            name="currently_working"
            checked={formData.currently_working}
            onChange={handleChange}
          />
          Currently working here
        </label>
      </div>
      {!formData.currently_working && (
        <div className="form-row">
          <label>End Date*</label>
          <div className="date-inputs">
            <select
              name="end_month"
              value={formData.end_month}
              onChange={handleChange}
              required={!formData.currently_working}
              disabled={formData.currently_working}
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
            <input
              type="number"
              name="end_year"
              min={formData.start_year}
              max={new Date().getFullYear()}
              value={formData.end_year}
              onChange={handleChange}
              required={!formData.currently_working}
              disabled={formData.currently_working}
            />
          </div>
        </div>
      )}
      <div className="form-row">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          maxLength={10000}
        />
      </div>
      <div className="form-row">
        <label>Skills</label>
        <SkillsAutocomplete
          value={formData.skills || []}
          onChange={handleSkillsChange}
          placeholder="Type to search skills..."
        />
      </div>
      <div className="button-row">
        <button type="submit" onClick={handleSubmit}>Save</button>
        {experience && (
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        )}
      </div>
    </FormWrapper>
  );
};

const ExperienceCard = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  position: relative;

  h4 {
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }
`;

const Actions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;

    &:hover {
      color: #333;
    }
  }
`;

const FormWrapper = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  .form-row {
    display: flex;
    flex-direction: column;

    label {
      font-size: 0.8rem;
      margin-bottom: 0.25rem;
      font-weight: 500;
    }

    input, select, textarea {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    textarea {
      resize: vertical;
    }
  }

  .date-inputs {
    display: flex;
    gap: 0.5rem;
    
    select, input {
      flex: 1;
    }
    
    input {
      width: 80px;
    }
  }

  .button-row {
    grid-column: span 2;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:first-child {
        background-color: #4CAF50;
        color: white;
      }

      &:last-child {
        background-color: #F05537;
        color: white;
      }
    }
  }

  /* Skills Autocomplete Styles */
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
  }
  
  .skill-tag {
    background-color: #414BEA;
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
  }
  
  .skills-input {
    width: 100%;
    padding: 8px 14px;
    border: 1px solid #0000004a;
    border-radius: 4px;
    font-size: 0.9rem;
    outline: none;
    color: #333;
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .suggestion-item {
    padding: 8px 14px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #333;
    transition: background-color 0.2s;
  }
  
  .suggestion-item:hover {
    background-color: #f0f0f0;
  }
  
  .suggestion-item:last-child {
    border-radius: 0 0 4px 4px;
  }
`;

export { WorkExperienceForm };