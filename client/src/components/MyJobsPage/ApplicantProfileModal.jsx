import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import LoadingComTwo from "../shared/LoadingComTwo";

const ApplicantProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    <h3>{user.username}'s Profile</h3>
                    <CloseButton onClick={onClose}>
                        <FaTimes />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <ProfileInfo>
                        <InfoRow>
                            <span>Full Name:</span>
                            <span>{user.username}</span>
                        </InfoRow>
                        <InfoRow>
                            <span>Email:</span>
                            <span>{user.email}</span>
                        </InfoRow>
                        {user.dob && (
                            <InfoRow>
                                <span>Date of Birth:</span>
                                <span>{new Date(user.dob).toLocaleDateString()}</span>
                            </InfoRow>
                        )}
                        {user.preference && (
                            <InfoRow>
                                <span>Job Preference:</span>
                                <span>
                                    {user.preference === 1 && "Job Only"}
                                    {user.preference === 2 && "Internship Only"}
                                    {user.preference === 3 && "Both Job and Internship"}
                                </span>
                            </InfoRow>
                        )}
                        
                        {user.education?.length > 0 && (
                            <EducationTable>
                                <h4>Education</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Degree</th>
                                            <th>Institution</th>
                                            <th>Field</th>
                                            <th>Start Year</th>
                                            <th>End Year</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user.education.map((edu, index) => (
                                            <tr key={index}>
                                                <td>{edu.degree}</td>
                                                <td>{edu.institution}</td>
                                                <td>{edu.field_of_study}</td>
                                                <td>{edu.start_year}</td>
                                                <td>{edu.end_year || 'Present'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </EducationTable>
                        )}
                    </ProfileInfo>
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 20px;
    position: relative;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;

    h3 {
        margin: 0;
        font-size: 1.5rem;
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #555;
    padding: 0;
    display: flex;
    align-items: center;
`;

const ModalBody = styled.div`
    padding: 10px 0;
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;

    span:first-child {
        font-weight: 600;
        color: #555;
    }
`;

const EducationTable = styled.div`
    margin-top: 20px;

    h4 {
        margin-bottom: 15px;
        font-size: 1.2rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    th, td {
        padding: 8px 12px;
        text-align: left;
        border: 1px solid #ddd;
    }

    th {
        background-color: #f5f5f5;
    }
`;

export default ApplicantProfileModal;