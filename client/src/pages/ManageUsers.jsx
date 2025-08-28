import React from "react";
import { useUserContext } from "../context/UserContext";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import ShimmerLoading from "../components/shared/ShimmerLoading";
import { CiSquarePlus } from "react-icons/ci";
import styled from "styled-components";
import Swal from "sweetalert2";
import { getAllHandler } from "../utils/FetchHandlers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ManageUsers = () => {
    const { user: me } = useUserContext();
    const {
        isPending,
        isError,
        data: users,
        error,
        refetch,
    } = useQuery({
        queryKey: ["users"],
        queryFn: () =>
            getAllHandler(`http://localhost:3000/api/users`),
    });

    const updateUserModal = (id, role) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#19b74b",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                UpdateUserRole(id, role);
            }
        });
    };

    const UpdateUserRole = async (id, role) => {
        const updateUser = { id, role };
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/admin/update-role`,
                updateUser,
                { withCredentials: true }
            );
            refetch();
            Swal.fire({
                title: "Done!",
                text: "Role Updated Successfully",
                icon: "success",
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Sorry!",
                text: error?.response?.data,
                icon: "error",
            });
        }
    };

    if (isPending) {
        return <ShimmerLoading type="table-rows" count={5} />;
    }

    if (isError) {
        return (
            <h2 className="text-lg md:text-3xl font-bold text-red-600 text-center mt-12">
                {error?.message}
            </h2>
        );
    }

    if (!users?.result?.length) {
        return (
            <h2 className="text-lg md:text-3xl font-bold text-red-600 text-center mt-12">
                -- User List is Empty --
            </h2>
        );
    }

    return (
        <Wrapper>
            <div className="title-row">
                Manage Users
            </div>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.result?.map((user, index) => {
                            let i = index + 1 < 10 ? `0${index + 1}` : index + 1;
                            return (
                                <tr key={user.id}>
                                    <td>{i}</td>
                                    <td>{user?.username}</td>
                                    <td>{user?.email}</td>
                                    <td>
                                        {user?.role === 1 ? 'Admin' : 
                                         user?.role === 2 ? 'Recruiter' : 
                                         'User'}
                                    </td>
                                    <td className="action-row">
                                        {user?.id === me.id ? null : (
                                            <>
                                                {user?.role !== 1 && (
                                                    <button
                                                        className="action admin"
                                                        onClick={() =>
                                                            updateUserModal(user.id, 1)
                                                        }
                                                    >
                                                        Admin
                                                    </button>
                                                )}
                                                {user?.role !== 2 && (
                                                    <button
                                                        className="action recruiter"
                                                        onClick={() =>
                                                            updateUserModal(user.id, 2)
                                                        }
                                                    >
                                                        Recruiter
                                                    </button>
                                                )}
                                                {user?.role !== 3 && (
                                                    <button
                                                        className="action user"
                                                        onClick={() =>
                                                            updateUserModal(user.id, 3)
                                                        }
                                                    >
                                                        User
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    padding: 16px;
    max-width: 100vw;
    overflow-x: hidden;
    box-sizing: border-box;
    
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
        margin-bottom: 20px;
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
    
    .table-container {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        margin-top: calc(1rem + 0.5vw);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .table {
        width: 100%;
        min-width: 600px;
        border-collapse: collapse;
        border-spacing: 0;
        border: 1px solid #ddd;
    }

    .table thead {
        background-color: var(--color-accent);
        color: var(--color-white);
        font-size: 14px;
        letter-spacing: 1px;
        font-weight: 400;
        text-transform: capitalize;
    }
    
    .table th,
    .table td {
        text-align: left;
        padding: 12px;
        white-space: nowrap;
    }
    
    .table th:first-child,
    .table td:first-child {
        position: sticky;
        left: 0;
        background-color: #f8f8f8;
        z-index: 1;
    }
    
    .table tbody tr {
        font-size: 14px;
        font-weight: 400;
        text-transform: capitalize;
        letter-spacing: 1px;
        transition: all 0.2s linear;
    }
    
    .table tbody tr:nth-child(even) {
        background-color: #00000011;
    }
    
    .table .action-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        column-gap: 8px;
        flex-wrap: wrap;
        row-gap: 8px;
    }
    
    .table .action-row .action {
        font-size: 14px;
        padding: 4px 8px;
        border-radius: 4px;
        color: #fff;
        text-transform: capitalize;
        border: none;
        cursor: pointer;
        white-space: nowrap;
    }
    
    .action.recruiter {
        background-color: #ac04ac;
    }
    
    .action.admin {
        background-color: #5f14c7;
    }
    
    .action.user {
        background-color: #c714c7;
    }
    
    /* Mobile-specific styles */
    @media (max-width: 768px) {
        padding: 12px;

        .table {
            min-width: 100%; /* Allow table to shrink */
            font-size: 0.85rem;
        }

        .table th,
        .table td {
            padding: 8px;
            white-space: normal; /* Allow text wrapping */
        }

        .status-badge,
        .edit-status-btn,
        .comment-indicator {
            font-size: 0.75rem;
        }

        .action {
            font-size: 1rem;
        }

        .status-edit-container {
            min-width: 150px;
        }

        .status-select,
        .comment-input {
            width: 100%;
        }
    }

    @media (max-width: 480px) {
        .table th,
        .table td {
            padding: 6px;
            font-size: 0.8rem;
        }

        .action-row {
            flex-direction: column;
            gap: 4px;
        }
    }
`;

export default ManageUsers;