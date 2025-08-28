import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import LoadingComTwo from "./shared/LoadingComTwo";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EducationForm = ({ education, fetchEducation }) => {
    const { user } = useUserContext();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        course_name: education?.course_name || "",
        specialization: education?.specialization || "",
        college_name: education?.college_name || "",
        percentage_cgpa: education?.percentage_cgpa || "",
        start_year: education?.start_year || "",
        end_year: education?.end_year || ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        const toastId = toast.loading("Saving education record...", {
            position: "top-right"
        });
        e.preventDefault();
        setLoading(true);

        if (!formData.college_name.trim()) {
            toast.update(toastId, {
                render: "College/Organization Name is required",
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

        if (!formData.course_name.trim()) {
            toast.update(toastId, {
                render: "Course Name is required",
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

        if (!formData.percentage_cgpa.trim()) {
            toast.update(toastId, {
                render: "Percentage/CGPA is required",
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

        if (!formData.start_year || isNaN(formData.start_year) || formData.start_year < 1900 || formData.start_year > new Date().getFullYear()) {
            toast.update(toastId, {
                render: "Valid Start Year is required",
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

        if (!formData.end_year || isNaN(formData.end_year) || formData.end_year < formData.start_year || formData.end_year > new Date().getFullYear() + 5) {
            toast.update(toastId, {
                render: "Valid End Year is required",
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

        try {
            if (education && education.id) {
                const response = await axios.patch(
                    `http://localhost:3000/api/education/${education.id}`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                toast.update(toastId, {
                    render: "Education Details Updated Successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                const response = await axios.post(
                    `http://localhost:3000/api/education`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                toast.update(toastId, {
                    render: "Education Details Added Successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }

            await fetchEducation();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save education:', {
                error: error.response?.data || error.message,
                config: error.config
            });
            showErrorAlert(
                'Error', 
                `Failed to save: ${error.response?.data?.message || error.message}`
            );
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
            allowOutsideClick: false, // Prevent closing by clicking outside
            allowEscapeKey: false, // Prevent closing with ESC key
            allowEnterKey: false // Prevent submitting with Enter key
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(
                    `http://localhost:3000/api/education/${education.id}`,
                    { withCredentials: true }
                );
                await fetchEducation();
                toast.success("Education record deleted successfully!", {
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

    if (!isEditing && education) {
        return (
            <EducationCard>
                <h4>{education.course_name}</h4>
                <p>{education.college_name}</p>
                <p>
                    {education.start_year} - {education.end_year} | {education.percentage_cgpa}
                </p>
                {education.specialization && <p>Specialization: {education.specialization}</p>}
                <Actions>
                    <button onClick={() => setIsEditing(true)}>
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button onClick={(e) => handleDelete(e)}>
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </Actions>
            </EducationCard>
        );
    }

    return (
        <FormWrapper 
            onSubmit={handleSubmit}
            method="post"
        >  
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
                <label>Specialization</label>
                <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                />
            </div>
            <div className="form-row">
                <label>College Name*</label>
                <input
                    type="text"
                    name="college_name"
                    value={formData.college_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-row">
                <label>Percentage/CGPA*</label>
                <input
                    type="text"
                    name="percentage_cgpa"
                    value={formData.percentage_cgpa}
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
            <div className="form-row">
                <label>End Year*</label>
                <input
                    type="number"
                    name="end_year"
                    min={formData.start_year || 1900}
                    max={new Date().getFullYear() + 5}
                    value={formData.end_year}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="button-row">
                <button type="submit" onClick={handleSubmit}>Save</button>
                {education && (
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                )}
            </div> 
        </FormWrapper>
    );
};

const EducationCard = styled.div`
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

        input {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
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
`;

export { EducationForm };