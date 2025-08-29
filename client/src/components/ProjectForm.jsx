import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import LoadingComTwo from "./shared/LoadingComTwo";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchSkillsByIds, fetchSkillsByName } from "../utils/skillsHelper";

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

const ProjectForm = ({ project, fetchProjects }) => {
    const formatDateForServer = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    const { user } = useUserContext();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: project?.title || "",
        description: project?.description || "",
        skills: project?.skills || [],
        project_url: project?.project_url || "",
        start_date: project?.start_date ? formatDateForServer(project.start_date) : "",
        end_date: project?.is_ongoing ? null : (project?.end_date ? formatDateForServer(project.end_date) : null),
        is_ongoing: project?.is_ongoing || false
    });

    const handleChange = (e) => {
        if (e.target.name === "is_ongoing") {
            setFormData({ ...formData, [e.target.name]: e.target.checked });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSkillsChange = (newSkills) => {
        setFormData(prev => ({
            ...prev,
            skills: newSkills
        }));
    };

    const showSuccessAlert = (title, text) => {
        toast.success(text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            pauseOnFocusLoss: true,
            progress: undefined,
            theme: "colored",
            transition: "slide"
        });
    };

    const showErrorAlert = (title, text) => {
        toast.error(text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            pauseOnFocusLoss: true,
            theme: "colored",
            transition: "slide",
            progress: undefined
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.title.trim()) {
            toast.error("Project title is required", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            setLoading(false);
            return;
        }

        if (!formData.start_date) {
            toast.error("Start date is required", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            setLoading(false);
            return;
        }

        if (!formData.is_ongoing && !formData.end_date) {
            toast.error("End date is required for non-ongoing projects", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            setLoading(false);
            return;
        }

        if (formData.project_url && !/^https?:\/\/.+/.test(formData.project_url)) {
            toast.error("Project URL must start with http:// or https://", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            setLoading(false);
            return;
        }

        try {
            // Process skills to ensure they're numbers
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
                title: formData.title.trim(),
                description: formData.description.trim(),
                skills: processedSkills,
                project_url: formData.project_url.trim(),
                start_date: formData.start_date,
                end_date: formData.is_ongoing ? null : formData.end_date,
                is_ongoing: formData.is_ongoing
            };

            if (project && project.id) {
                await axios.patch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/projects/${project.id}`,
                    payload,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                toast.success("Project updated successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            } else {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/projects`,
                    payload,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                toast.success("Project created successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }

            await fetchProjects();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save project:', {
                error: error.response?.data || error.message,
                config: error.config
            });
            toast.error(`Failed to save: ${error.response?.data?.message || error.message}`, {
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
            allowEscapeKey: false,
            allowEnterKey: false
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/api/projects/${project.id}`,
                    { withCredentials: true }
                );
                await fetchProjects();
                toast.success("Project deleted successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
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

    if (!isEditing && project) {
        return (
            <ProjectCard>
                <h4>{project.title}</h4>
                {project.description && <p>{project.description}</p>}
                <p>
                    {new Date(project.start_date).toLocaleDateString()} -
                    {project.is_ongoing ? 'Present' : new Date(project.end_date).toLocaleDateString()}
                </p>
                {project.project_url && (
                    <p>
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                            View Project
                        </a>
                    </p>
                )}
                <Actions>
                    <button onClick={() => setIsEditing(true)}>
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button onClick={(e) => handleDelete(e)}>
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </Actions>
            </ProjectCard>
        );
    }

    return (
        <FormWrapper
            onSubmit={handleSubmit}
            method="post"
        >
            <div className="form-row">
                <label>Project Title*</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-row full-width">
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
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
            <div className="form-row">
                <label>Project URL</label>
                <input
                    type="url"
                    name="project_url"
                    value={formData.project_url}
                    onChange={handleChange}
                    validatePattern="https?://.+"
                    placeholder="https://example.com"
                />
            </div>
            <div className="form-row">
                <label>Start Date*</label>
                <input
                    type="date"
                    name="start_date"
                    value={formData.start_date || ""}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            start_date: e.target.value || null
                        });
                    }}
                    required
                />
            </div>

            <div className="form-row">
                <label>End Date</label>
                <input
                    type="date"
                    name="end_date"
                    value={formData.end_date || ""}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            end_date: e.target.value || null
                        });
                    }}
                    disabled={formData.is_ongoing}
                />
            </div>

            <div className="form-row">
                <label>
                    <input
                        type="checkbox"
                        name="is_ongoing"
                        checked={formData.is_ongoing}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                is_ongoing: e.target.checked,
                                end_date: e.target.checked ? null : formData.end_date
                            });
                        }}
                    />
                    Ongoing Project
                </label>
            </div>
            <div className="button-row">
                <button type="submit" onClick={handleSubmit}>Save</button>
                {project && (
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                )}
            </div>
        </FormWrapper>
    );
};

const ProjectCard = styled.div`
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

    a {
        color: #4CAF50;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const FormWrapper = styled.form`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;

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

    .form-row {
        display: flex;
        flex-direction: column;

        label {
            font-size: 0.8rem;
            margin-bottom: 0.25rem;
            font-weight: 500;
        }

        input, textarea {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        input[type="checkbox"] {
            margin-right: 0.5rem;
        }
    }

    .full-width {
        grid-column: span 2;
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

export { ProjectForm };