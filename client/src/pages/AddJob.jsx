/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CiSquarePlus } from "react-icons/ci";
import { Job_Status, Job_Type } from "../utils/JobData";
import { fetchSkillsByIds, fetchSkillsByName } from "../utils/skillsHelper";
import { fetchCategoriesByIds, fetchCategoriesByName } from "../utils/categoriesHelper";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaHome, FaMoneyBillWave, FaClock, FaFileAlt, FaLaptop, FaUtensils, FaAward, FaHandshake, FaCar, FaMedkit, FaChalkboardTeacher, FaChartLine } from "react-icons/fa";
import { fetchFacilitiesByIds } from "../utils/facilitiesHelper";
import { TagsInput } from "react-tag-input-component";
import { use } from "react";

const SalaryTypes = [
    { id: 'FIXED', label: 'Fixed' },
    { id: 'RANGE', label: 'Range' },
    { id: 'FIXED_INCENTIVE', label: 'Fixed + Incentives' },
    { id: 'UNPAID', label: 'Unpaid' }
];

const Currencies = [
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' }
];

const SalaryPeriods = [
    { id: 'MONTH', label: 'Per Month' },
    { id: 'YEAR', label: 'Per Year' },
    { id: 'HOUR', label: 'Per Hour' },
    { id: 'WEEK', label: 'Per Week' }
];

const FacilitiesCardSelector = ({ value, onChange }) => {
    const [facilitiesData, setFacilitiesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const facilityIcons = {
        "Work From Home": <FaHome size={24} />,
        "Stipend / Salary": <FaMoneyBillWave size={24} />,
        "Flexible Working Hours": <FaClock size={24} />,
        "Certificate / Experience Letter": <FaFileAlt size={24} />,
        "Laptop / Equipment Provided": <FaLaptop size={24} />,
        "Free Meals / Snacks": <FaUtensils size={24} />,
        "Performance Bonus / Incentives": <FaAward size={24} />,
        "Job Offer on Completion (PPO)": <FaHandshake size={24} />,
        "Travel / Cab Facility": <FaCar size={24} />,
        "Health Insurance / Mediclaim": <FaMedkit size={24} />,
        "Training and Mentorship": <FaChalkboardTeacher size={24} />,
        "ESOPs / Equity": <FaChartLine size={24} />
    };

    useEffect(() => {
        const loadAllFacilities = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/facilities`, {
                    credentials: 'include',
                });
                const data = await response.json();
                setFacilitiesData(data.data || data);
                setError(null);
            } catch (err) {
                setError('Failed to load facilities');
                console.error('Facilities loading error:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAllFacilities();
    }, []);

    const toggleFacility = (id) => {
        if (value.includes(id)) {
            onChange(value.filter(facilityId => facilityId !== id));
        } else {
            onChange([...value, id]);
        }
    };

    if (loading) return <div className="loading-facilities">Loading facilities...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!facilitiesData || facilitiesData.length === 0) return <div className="no-facilities">No facilities available</div>;

    return (
        <div className="facilities-grid">
            {facilitiesData.map((facility) => (
                <div
                    key={facility.facilities_id}
                    className={`facility-card ${value.includes(facility.facilities_id) ? 'selected' : ''}`}
                    onClick={() => toggleFacility(facility.facilities_id)}
                >
                    <div className="facility-icon">
                        {facilityIcons[facility.facilities_name] || <FaQuestion size={24} />}
                    </div>
                    <div className="facility-name">{facility.facilities_name}</div>
                </div>
            ))}
        </div>
    );
};

const CategoriesAutocomplete = ({ value, onChange, placeholder = "Type to search categories..." }) => {
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentCategories, setCurrentCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCurrentCategories = async () => {
            if (value?.length > 0) {
                setLoading(true);
                setError(null);
                try {
                    const categories = await fetchCategoriesByIds(value);
                    setCurrentCategories(categories);
                } catch (err) {
                    setError('Failed to load current categories');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setCurrentCategories([]);
            }
        };
        loadCurrentCategories();
    }, [value]);

    useEffect(() => {
        if (inputValue.length > 1) {
            const timer = setTimeout(async () => {
                try {
                    const categories = await fetchCategoriesByName(inputValue);
                    setFilteredCategories(categories);
                    setShowSuggestions(categories.length > 0);
                    setError(null);
                } catch (err) {
                    setError('Failed to search categories');
                    console.error(err);
                    setFilteredCategories([]);
                    setShowSuggestions(false);
                }
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setFilteredCategories([]);
            setShowSuggestions(false);
        }
    }, [inputValue]);

    const handleAddCategory = (category) => {
        if (!value.includes(category.category_id)) {
            onChange([...value, category.category_id]);
        }
        setInputValue("");
        setShowSuggestions(false);
    };

    const handleRemoveCategory = (categoryId) => {
        onChange(value.filter(id => id !== categoryId));
    };

    return (
        <div className="skills-autocomplete">
            <div className="skills-tags">
                {loading && <span>Loading categories...</span>}
                {error && <span className="error">{error}</span>}
                {currentCategories.map(category => (
                    <span key={category.category_id} className="skill-tag">
                        {category.category_name}
                        <button
                            type="button"
                            onClick={() => handleRemoveCategory(category.category_id)}
                            className="remove-skill"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className="skills-input"
                    onFocus={() => inputValue && setShowSuggestions(filteredCategories.length > 0)}
                />
                {showSuggestions && (
                    <div className="suggestions-dropdown">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.category_id}
                                className="suggestion-item"
                                onClick={() => handleAddCategory(category)}
                            >
                                {category.category_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Custom Skills Input Component with Autocomplete
const SkillsAutocomplete = ({ value, onChange, placeholder = "Type to search skills..." }) => {
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentSkills, setCurrentSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

            <div className="input-container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className="skills-input"
                    onFocus={() => inputValue && setShowSuggestions(filteredSkills.length > 0)}
                />

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

const AddJob = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [deadline, setDeadline] = useState(new Date());
    const [skills, setSkills] = useState([]);
    const [categories, setCategories] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [workplaceType, setWorkplaceType] = useState(null);
    const [eligibility, setEligibility] = useState(null);
    const [studentCurrentlyStudying, setStudentCurrentlyStudying] = useState(false);
    const [selectedYears, setSelectedYears] = useState([]);
    const [experienceMin, setExperienceMin] = useState('');
    const [experienceMax, setExperienceMax] = useState('');
    const [salaryType, setSalaryType] = useState('FIXED');
    const [fixedAmount, setFixedAmount] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [incentiveDetails, setIncentiveDetails] = useState('');
    const [isSalaryHidden, setIsSalaryHidden] = useState(false);
    const [currency, setCurrency] = useState('INR');
    const [salaryPeriod, setSalaryPeriod] = useState('MONTH');

    const EligibilityTypes = [
        { id: 1, label: 'College Student' },
        { id: 2, label: 'Fresher' },
        { id: 3, label: 'Experienced' }
    ];

    const YearOptions = ['All', '2023', '2024', '2025'];

    const handleEligibilityChange = (typeId) => {
        setEligibility(typeId);
        if (typeId === 1) {
            // College Student - auto select and disable the checkbox
            setStudentCurrentlyStudying(true);
            toast.info("Open for college students currently studying");
        } else {
            // Fresher or Experienced - keep checkbox as is
            setStudentCurrentlyStudying(false);
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (categories.length > 10) {
            toast.error("You can select a maximum of 10 categories.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (facilities.length === 0) {
            toast.error("Please select at least one job facility.");
            return;
        }

        if (skills.length === 0) {
            toast.error("Please select at least one required skill.");
            return;
        }

        if (!eligibility) {
            toast.error("Please select eligibility type");
            return;
        }

        if (eligibility === 1 && !studentCurrentlyStudying) {
            toast.error("College student jobs must be open for currently studying students");
            return;
        }

        if (eligibility === 2 && selectedYears.length === 0) {
            toast.error("Please select at least one graduation year");
            return;
        }

        if (eligibility === 3 && (!experienceMin || !experienceMax)) {
            toast.error("Please enter both min and max experience");
            return;
        }

        if (eligibility === 3 && parseFloat(experienceMax) < parseFloat(experienceMin)) {
            toast.error("Max experience must be greater than or equal to min experience");
            return;
        }

        if (salaryType !== 'UNPAID') {
            if (['FIXED', 'FIXED_INCENTIVE'].includes(salaryType) && !fixedAmount) {
                toast.error("Please enter the fixed amount");
                return;
            }

            if (salaryType === 'RANGE') {
                if (!minAmount || !maxAmount) {
                    toast.error("Please enter both min and max amounts");
                    return;
                }
                if (parseFloat(maxAmount) < parseFloat(minAmount)) {
                    toast.error("Max amount must be greater than or equal to min amount");
                    return;
                }
            }

            if (salaryType === 'FIXED_INCENTIVE' && !incentiveDetails) {
                toast.error("Please provide incentive details");
                return;
            }
        }

        setIsLoading(true);
        const newJob = {
            company: data?.company,
            position: data?.position,
            workplace_type: workplaceType,
            job_status: selectedStatus || data?.status,
            job_type: selectedType || data?.type,
            job_location: workplaceType === 1 ? null : data?.location,
            job_vacancy: data?.vacancy,
            salary_type: salaryType,
            fixed_amount: ['FIXED', 'FIXED_INCENTIVE'].includes(salaryType) ? parseFloat(fixedAmount) : null,
            min_amount: salaryType === 'RANGE' ? parseFloat(minAmount) : null,
            max_amount: salaryType === 'RANGE' ? parseFloat(maxAmount) : null,
            incentive_details: salaryType === 'FIXED_INCENTIVE' ? incentiveDetails : null,
            is_salary_hidden: isSalaryHidden,
            currency,
            salary_period: salaryPeriod,
            job_deadline: deadline.toISOString(),
            job_description: data?.description,
            job_skills: skills,
            categories: categories,
            job_facilities: facilities,
            job_contact: data?.contact,
            eligibility,
            student_currently_studying: studentCurrentlyStudying,
            year_selection: eligibility === 2 ? selectedYears : null,
            experience_min: eligibility === 3 ? parseFloat(experienceMin) : null,
            experience_max: eligibility === 3 ? parseFloat(experienceMax) : null,
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/jobs`,
                newJob,
                {
                    withCredentials: true,
                }
            );

            toast.success("Job created successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            reset();
            setDeadline(new Date());
            setSkills([]);
            setCategories([]);
            setFacilities([]);
            setSelectedStatus(null);
            setSelectedType(null);
            setWorkplaceType(null);
            setEligibility(null);
        } catch (error) {
            console.log(error);
            if (error.response) {
                const backendError = error.response.data?.message || error.response.data?.error;
                if (backendError) {
                    toast.error(backendError);
                } else {
                    toast.error("Failed to create job. Please try again.");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
        } finally {
            setIsLoading(false);
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
            <div className="">
                <div className="title-row">
                    Create Job
                    <CiSquarePlus className="ml-1 text-xl md:text-2xl" />
                </div>
                <div className="content-row">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form">
                            {/* Position */}
                            <div className="row">
                                <label htmlFor="position">Position</label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    placeholder="Job Position"
                                    {...register("position", {
                                        required: {
                                            value: true,
                                            message: "Job Positon is required",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Too long (max 100char)",
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Too short (max 3char)",
                                        },
                                    })}
                                />
                                {errors?.position && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.position?.message}
                                    </span>
                                )}
                            </div>

                            {/* Company */}
                            <div className="row">
                                <label htmlFor="company">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    placeholder="Company Name"
                                    {...register("company", {
                                        required: {
                                            value: true,
                                            message: "Job Company is required",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Too long (max 100char)",
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Too short (max 3char)",
                                        },
                                    })}
                                />
                                {errors?.company && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.company?.message}
                                    </span>
                                )}
                            </div>

                            {/* Workplace Type */}
                            <div className="row">
                                <label htmlFor="workplaceType">Workplace Type</label>
                                <div className="workplace-tags">
                                    {[
                                        { id: 1, label: 'Work from home' },
                                        { id: 2, label: 'In office' },
                                        { id: 3, label: 'On field' },
                                        { id: 4, label: 'Hybrid' }
                                    ].map((type) => (
                                        <button
                                            type="button"
                                            key={type.id}
                                            className={`workplace-tag ${workplaceType === type.id ? 'selected' : ''}`}
                                            onClick={() => {
                                                setWorkplaceType(type.id);
                                                setValue("workplaceType", type.id);
                                            }}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                                {errors?.workplaceType && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.workplaceType?.message}
                                    </span>
                                )}
                            </div>

                            {/* Location */}
                            {workplaceType !== 1 && (
                                <div className="row">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        placeholder="Job Location"
                                        {...register("location", {
                                            required: {
                                                value: workplaceType !== 1,
                                                message: "Job Location is required for this workplace type",
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "Too long (max 100char)",
                                            },
                                            minLength: {
                                                value: 3,
                                                message: "Too short (max 3char)",
                                            },
                                        })}
                                    />
                                    {errors?.location && (
                                        <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                            {errors?.location?.message}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Status */}
                            <div className="row">
                                <label htmlFor="status">Job Status</label>
                                <div className="status-tags">
                                    {Job_Status?.map((status) => (
                                        <button
                                            type="button"
                                            key={status}
                                            className={`status-tag ${selectedStatus === status ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedStatus(status);
                                                // Set the value for react-hook-form
                                                setValue("status", status);
                                            }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                {errors?.status && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.status?.message}
                                    </span>
                                )}
                            </div>

                            {/* Type */}
                            <div className="row">
                                <label htmlFor="type">Job Type</label>
                                <div className="type-tags">
                                    {Job_Type?.map((type) => (
                                        <button
                                            type="button"
                                            key={type}
                                            className={`type-tag ${selectedType === type ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedType(type);
                                                // Set the value for react-hook-form
                                                setValue("type", type);
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                {errors?.type && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.type?.message}
                                    </span>
                                )}
                            </div>

                            <div className="row">
                                <label htmlFor="eligibility">Eligibility</label>
                                <div className="eligibility-tags">
                                    {EligibilityTypes.map((type) => (
                                        <button
                                            type="button"
                                            key={type.id}
                                            className={`eligibility-tag ${eligibility === type.id ? 'selected' : ''}`}
                                            onClick={() => handleEligibilityChange(type.id)}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Student Currently Studying Checkbox */}
                            {eligibility && (
                                <div className="row">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={studentCurrentlyStudying}
                                            onChange={(e) => {
                                                if (eligibility !== 1) { // Only allow changes if not College Student
                                                    setStudentCurrentlyStudying(e.target.checked);
                                                }
                                            }}
                                            disabled={eligibility === 1} // Disable for College Student
                                        />
                                        Open for college students currently studying
                                        {eligibility === 1 && <span className="text-xs text-gray-500 ml-2">(Required for College Students)</span>}
                                    </label>
                                </div>
                            )}

                            {/* Year Selection (shown only for Freshers) */}
                            {eligibility === 2 && (
                                <div className="row">
                                    <label>Select Graduation Years</label>
                                    <div className="year-tags">
                                        {YearOptions.map((year) => (
                                            <button
                                                type="button"
                                                key={year}
                                                className={`year-tag ${selectedYears.includes(year) ? 'selected' : ''
                                                    }`}
                                                onClick={() => {
                                                    if (year === 'All') {
                                                        setSelectedYears(['All']);
                                                    } else {
                                                        if (selectedYears.includes('All')) {
                                                            setSelectedYears([year]);
                                                        } else if (selectedYears.includes(year)) {
                                                            setSelectedYears(selectedYears.filter(y => y !== year));
                                                        } else {
                                                            setSelectedYears([...selectedYears, year]);
                                                        }
                                                    }
                                                }}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                    {errors?.yearSelection && (
                                        <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                            {errors?.yearSelection?.message}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Experience Range (shown only for Experienced) */}
                            {eligibility === 3 && (
                                <div className="flex gap-4">
                                    <div className="row">
                                        <label htmlFor="experienceMin">Min Experience (years)</label>
                                        <input
                                            type="number"
                                            id="experienceMin"
                                            value={experienceMin}
                                            onChange={(e) => setExperienceMin(e.target.value)}
                                            min="0"
                                            step="0.5"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="row">
                                        <label htmlFor="experienceMax">Max Experience (years)</label>
                                        <input
                                            type="number"
                                            id="experienceMax"
                                            value={experienceMax}
                                            onChange={(e) => setExperienceMax(e.target.value)}
                                            min={experienceMin || '0'}
                                            step="0.5"
                                            placeholder="5"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Vacancy */}
                            <div className="row">
                                <label htmlFor="vacancy">Vacancy</label>
                                <input
                                    type="text"
                                    id="vacancy"
                                    name="vacancy"
                                    placeholder="Job Vacancy"
                                    {...register("vacancy", {
                                        required: {
                                            value: true,
                                            message: "Job vacancy is required",
                                        },
                                        max: {
                                            value: 1000,
                                            message:
                                                "Check number of job vacancy(too much)",
                                        },
                                        min: {
                                            value: 1,
                                            message:
                                                "Job Vacancy can't 0 or smaller",
                                        },
                                    })}
                                />
                                {errors?.vacancy && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.vacancy?.message}
                                    </span>
                                )}
                            </div>

                            {/* Salary Type */}
                            <div className="row">
                                <label htmlFor="salaryType">Salary Type</label>
                                <div className="salary-tags">
                                    {SalaryTypes.map((type) => (
                                        <button
                                            type="button"
                                            key={type.id}
                                            className={`salary-tag ${salaryType === type.id ? 'selected' : ''}`}
                                            onClick={() => setSalaryType(type.id)}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                                <p className="salary-info-text">
                                    The stipend on the listing page will be shown in months only
                                </p>
                            </div>

                            {/* Salary Details */}
                            {salaryType !== 'UNPAID' && (
                                <div className="salary-details-container">
                                    {/* Currency and Period */}
                                    <div className="salary-meta-fields">
                                        <div className="currency-selector">
                                            <label>Currency</label>
                                            <select
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value)}
                                            >
                                                {Currencies.map(curr => (
                                                    <option key={curr.code} value={curr.code}>
                                                        {curr.code} - {curr.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="period-selector">
                                            <label>Period</label>
                                            <select
                                                value={salaryPeriod}
                                                onChange={(e) => setSalaryPeriod(e.target.value)}
                                            >
                                                {SalaryPeriods.map(period => (
                                                    <option key={period.id} value={period.id}>
                                                        {period.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Fixed Amount */}
                                    {['FIXED', 'FIXED_INCENTIVE'].includes(salaryType) && (
                                        <div className="salary-input-field">
                                            <label>Amount</label>
                                            <input
                                                type="number"
                                                value={fixedAmount}
                                                onChange={(e) => setFixedAmount(e.target.value)}
                                                placeholder="Enter amount"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    )}

                                    {/* Range Amount */}
                                    {salaryType === 'RANGE' && (
                                        <div className="salary-range-fields">
                                            <div className="salary-input-field">
                                                <label>Min Amount</label>
                                                <input
                                                    type="number"
                                                    value={minAmount}
                                                    onChange={(e) => setMinAmount(e.target.value)}
                                                    placeholder="Min amount"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                            <div className="salary-input-field">
                                                <label>Max Amount</label>
                                                <input
                                                    type="number"
                                                    value={maxAmount}
                                                    onChange={(e) => setMaxAmount(e.target.value)}
                                                    placeholder="Max amount"
                                                    min={minAmount || '0'}
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Incentive Details */}
                                    {salaryType === 'FIXED_INCENTIVE' && (
                                        <div className="incentive-details">
                                            <label>Incentive Details</label>
                                            <textarea
                                                value={incentiveDetails}
                                                onChange={(e) => setIncentiveDetails(e.target.value)}
                                                placeholder="Describe the incentive structure (e.g., performance bonus, commissions)"
                                                rows={3}
                                            />
                                        </div>
                                    )}

                                    {/* Salary Visibility */}
                                    <div className="salary-visibility">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={isSalaryHidden}
                                                onChange={(e) => setIsSalaryHidden(e.target.checked)}
                                            />
                                            Do not disclose salary to candidates
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Deadline */}
                            <div className="row">
                                <label htmlFor="deadline">Job Deadline</label>
                                <DatePicker
                                    selected={deadline}
                                    onChange={(date) => setDeadline(date)}
                                    minDate={
                                        new Date(
                                            new Date().getTime() +
                                            3 * 24 * 60 * 60 * 1000
                                        )
                                    }
                                />
                            </div>

                            {/* Contact */}
                            <div className="row">
                                <label htmlFor="contact">Contact Mail</label>
                                <input
                                    type="text"
                                    id="contact"
                                    name="contact"
                                    placeholder="Job Contact"
                                    {...register("contact", {
                                        required: {
                                            value: true,
                                            message: "Job contact is required",
                                        },
                                    })}
                                />
                                {errors?.contact && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.contact?.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Tag inputs */}
                        <div className="flex flex-col  min-[600px]:flex-row  justify-between items-center gap-4 mt-5">
                            <div className="row gap-y-2">
                                <label htmlFor="skills">Job Categories</label>
                                <CategoriesAutocomplete
                                    value={categories}
                                    onChange={setCategories}
                                    placeholder="Type to search categories..."
                                />
                                {categories.length >= 10 && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        You have reached a maximum of 10 categories.
                                    </span>
                                )}
                            </div>
                            <div className="row gap-y-2">
                                <label htmlFor="skills">Required Skills</label>
                                <SkillsAutocomplete
                                    value={skills}
                                    onChange={setSkills}
                                    placeholder="Type to search skills..."
                                />
                            </div>
                        </div>
                        <div className="row gap-y-2 mt-5">
                            <label htmlFor="facilities">Job Facilities *</label>
                            <FacilitiesCardSelector
                                value={facilities}
                                onChange={setFacilities}
                            />
                            {errors.facilities && (
                                <div className="facilities-error">
                                    {errors.facilities.message}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="row  mt-5">
                            <label htmlFor="description">Job Description</label>
                            <textarea
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Job Description"
                                className="w-full max-w-none"
                                {...register("description", {
                                    required: {
                                        value: true,
                                        message: "Job description is required",
                                    },
                                    maxLength: {
                                        value: 2000,
                                        message: "Too long (max 2000char)",
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "Too short (max 10char)",
                                    },
                                })}
                            />
                            {errors?.description && (
                                <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                    {errors?.description?.message}
                                </span>
                            )}
                        </div>

                        <div className="row mt-4 sm:mt-0">
                            <label htmlFor="" className="invisible">
                                delete
                            </label>
                            <input
                                type="submit"
                                value="submit"
                                className="btn"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    padding: 0 2rem;
    max-width: 1600px;
    margin: 0 auto;
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
    }
    .title-row:before {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: calc(30px + 0.7vw);
        height: calc(2px + 0.1vw);
        background-color: var(--color-primary);
    }
    .content-row {
        margin-top: calc(2rem + 0.5vw);
    }
    .form {
        margin-top: calc(30px + 1vw);
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: space-between;
        align-items: center;
        grid-gap: calc(1rem + 0.5vw);
    }
    @media screen and (max-width: 1000px) {
        .form {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media screen and (max-width: 600px) {
        .form {
            grid-template-columns: 1fr;
        }
    }

    .eligibility-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 6px;
    }

    .eligibility-tag {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        background-color: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .checkbox-label input:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .checkbox-label input:disabled + span {
        opacity: 0.7;
    }

    .eligibility-tag.selected {
        background-color: #414FEA;
        color: white;
        border-color: #414FEA;
    }

    .year-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 6px;
    }

    .year-tag {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        background-color: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .year-tag.selected {
        background-color: #414FEA;
        color: white;
        border-color: #414FEA;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        cursor: pointer;
    }

    .checkbox-label input {
        width: auto;
        margin-top: 0;
    }

    .row {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .row label {
        font-size: 11.3px;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--color-black);
        opacity: 0.95;
    }
    input,
    select,
    textarea {
        width: 100%;
        max-width: 500px;
        padding: 8px 14px;
        margin-top: 6px;
        display: inline-block;
        border: 1px solid #0000004a;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: calc(0.8rem + 0.1vw);
        outline: none;
        color: var(--color-black);
    }
    textarea {
        max-width: none;
        min-height: 100px;
    }
    select {
        padding-left: 2px;
        text-transform: capitalize;
    }
    input:focus,
    select:focus,
    textarea:focus {
        outline: none;
        border: 1px solid #00000086;
    }
    .input-cls {
        max-width: none;
        width: 100%;
        font-size: 13px;
        padding: 5px 10px;
    }
    .tag-cls {
        font-size: 14px;
    }

    .status-tags, .type-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 6px;
    }

    .status-tag, .type-tag {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        background-color: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .status-tag.selected, .type-tag.selected {
        background-color: #414FEA;
        color: white;
        border-color: #414FEA;
    }

    .status-tag:hover, .type-tag:hover {
        background-color: #f0f0f0;
    }

    .status-tag.selected:hover, .type-tag.selected:hover {
        background-color: #414FEA;
        opacity: 0.9;
    }

    .facilities-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr); /* 6 cards per row on desktop */
        gap: 12px;
        margin-top: 8px;
        width: 100%;
    }

    /* Mobile view - 2 cards per row */
    @media screen and (max-width: 768px) {
        .facilities-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .facility-card {
            height: 100px; /* Smaller height on mobile */
            padding: 8px;
        }
        
        .facility-icon {
            margin-bottom: 4px;
        }
        
        .facility-name {
            font-size: 11px;
        }
    }

    .facilities-error {
        border: 1px solid #ff4444;
        border-radius: 4px;
        padding: 8px;
        margin-top: 8px;
        background-color: #fff0f0;
        color: #ff4444;
        font-size: 12px;
    }

    .facility-card {
        border: 2px dashed #ccc;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        height: 120px;
        text-align: center;
        background: white;
    }

    .facility-card:hover {
        border-color: #414FEA;
        background-color: #f8f9ff;
    }

    .facility-card.selected {
        border: 2px solid #414FEA;
        background-color: #f0f3ff;
        border-style: solid;
    }

    .facility-icon {
        margin-bottom: 8px;
        color: #414FEA;
    }

    .facility-name {
        font-size: 12px;
        font-weight: 500;
    }

    .loading-facilities,
    .no-facilities,
    .error-message {
        padding: 12px;
        text-align: center;
        color: #666;
        font-size: 14px;
    }

    .error-message {
        color: #ff4444;
    }

    .workplace-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 6px;
    }

    .workplace-tag {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        background-color: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .workplace-tag.selected {
        background-color: #414FEA;
        color: white;
        border-color: #414FEA;
    }

    .workplace-tag:hover {
        background-color: #f0f0f0;
    }

    .workplace-tag.selected:hover {
        background-color: #414FEA;
        opacity: 0.9;
    }
    
    /* Skills Autocomplete Styles */
    .skills-autocomplete {
        width: 100%;
        max-width: 500px;
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
        background-color: var(--color-primary, #414BEA);
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    
    .suggestion-item:last-child {
        border-radius: 0 0 4px 4px;
    }
    
    .btn {
        width: 100%;
        max-width: 150px;
        height: 100%;
        display: inline-block;
        background-color: var(--color-black);
        color: var(--color-white);
        cursor: pointer;
        transition: all 0.3s linear;
        text-transform: capitalize;
        font-size: calc(0.9rem + 0.1vw);
    }
    .btn:hover {
        background-color: var(--color-primary);
    }
    @media screen and (max-width: 600px) {
        .btn {
            margin: 0 auto;
            margin-top: -6px;
        }
    }

    /* Salary Tags */
    .salary-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 6px;
    }

    .salary-tag {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        background-color: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .salary-tag.selected {
        background-color: #414FEA;
        color: white;
        border-color: #414FEA;
    }

    .salary-info-text {
        font-size: 11px;
        color: #666;
        margin-top: 4px;
        font-style: italic;
    }

    /* Salary Details Container */
    .salary-details-container {
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
        margin-top: 12px;
        background-color: #f9f9f9;
    }

    .salary-meta-fields {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
    }

    .currency-selector,
    .period-selector {
        flex: 1;
    }

    .currency-selector select,
    .period-selector select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 4px;
    }

    .salary-input-field {
        margin-bottom: 16px;
    }

    .salary-input-field input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 4px;
    }

    .salary-range-fields {
        display: flex;
        gap: 16px;
    }

    .salary-range-fields .salary-input-field {
        flex: 1;
    }

    .incentive-details textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 4px;
        min-height: 80px;
    }

    .salary-visibility {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #eee;
    }
`;

export default AddJob;