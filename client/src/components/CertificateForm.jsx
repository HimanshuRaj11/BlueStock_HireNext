import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import LoadingComTwo from "./shared/LoadingComTwo";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CertificateForm = ({ certificate, fetchCertificates }) => {
    const formatDateForServer = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    const { user } = useUserContext();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: certificate?.title || "",
        issuing_organization: certificate?.issuing_organization || "",
        issue_date: formatDateForServer(certificate?.issue_date || ""),
        expiry_date: formatDateForServer(certificate?.expiry_date || null),
        credential_id: certificate?.credential_id || "",
        credential_url: certificate?.credential_url || "",
        description: certificate?.description || ""
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
        e.preventDefault();
        setLoading(true);

        if (!formData.title.trim()) {
            toast.error("Certificate title is required", {  
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

        if (!formData.issuing_organization.trim()) {
            toast.error("Issuing organization is required", {
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

        if (!formData.issue_date) {
            toast.error("Issue date is required", {
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

        if (formData.credential_url && !/^https?:\/\/.+/.test(formData.credential_url)) {
            toast.error("Credential URL must start with http:// or https://", {
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
            if (certificate && certificate.id) {
                const response = await axios.patch(
                    `http://localhost:3000/api/certificates/${certificate.id}`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                toast.success("Certificate updated successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            } else {
                const response = await axios.post(
                    `http://localhost:3000/api/certificates`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                toast.success("Certificate created successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }

            await fetchCertificates();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save certificate:', {
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
                    `http://localhost:3000/api/certificates/${certificate.id}`,
                    { withCredentials: true }
                );
                await fetchCertificates();
                toast.success("Certificate deleted successfully!", {
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

    if (!isEditing && certificate) {
        return (
            <CertificateCard>
                <h4>{certificate.title}</h4>
                <p>{certificate.issuing_organization}</p>
                <p>
                    {new Date(certificate.issue_date).toLocaleDateString()} - 
                    {certificate.expiry_date ? new Date(certificate.expiry_date).toLocaleDateString() : 'Present'}
                </p>
                {certificate.credential_id && <p>Credential ID: {certificate.credential_id}</p>}
                {certificate.description && <p>Description: {certificate.description}</p>}
                {certificate.credential_url && (
                    <p>
                        <a href={certificate.credential_url} target="_blank" rel="noopener noreferrer">
                            View Credential
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
            </CertificateCard>
        );
    }

    return (
        <FormWrapper 
            onSubmit={handleSubmit}
            method="post"
        >  
            <div className="form-row">
                <label>Certificate Title*</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-row">
                <label>Issuing Organization*</label>
                <input
                    type="text"
                    name="issuing_organization"
                    value={formData.issuing_organization}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-row">
                <label>Issue Date*</label>
                <input
                    type="date"
                    name="issue_date"
                    value={formData.issue_date ? new Date(formData.issue_date).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                />
            </div>
            <div className="form-row">
                <label>Expiry Date</label>
                <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date ? new Date(formData.expiry_date).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    min={formData.issue_date}
                />
            </div>
            <div className="form-row">
                <label>Credential ID</label>
                <input
                    type="text"
                    name="credential_id"
                    value={formData.credential_id}
                    onChange={handleChange}
                />
            </div>
            <div className="form-row">
                <label>Credential URL</label>
                <input
                    type="url"
                    name="credential_url"
                    value={formData.credential_url}
                    onChange={handleChange}
                    validatePattern="https?://.+"
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
            <div className="button-row">
                <button type="submit" onClick={handleSubmit}>Save</button>
                {certificate && (
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                )}
            </div> 
        </FormWrapper>
    );
};

const CertificateCard = styled.div`
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

export { CertificateForm };