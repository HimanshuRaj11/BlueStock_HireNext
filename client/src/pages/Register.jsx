import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../utils/googleAuth";

const Register = () => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    const [isPasswordMatched, setIsPasswordMatched] = useState({
        status: true,
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const { full_name, username, email, password, confirmPassword } = data;

        if (password !== confirmPassword) {
            setIsPasswordMatched({
                status: false,
                message: "Both password not matched.",
            });
            return;
        } else {
            setIsLoading(true);
            const user = { full_name, username, email, password, signup_type: "e" };
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
                    user
                );

                Swal.fire({
                    icon: "success",
                    title: "Hurray...",
                    text: response?.data?.message,
                });
                reset();
                navigate("/login");
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error?.response?.data,
                });
            }
        }
        setIsLoading(false);
    };

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        try {
            const { user, error } = await signInWithGoogle();

            if (error) {
                throw new Error(error.message);
            }

            // Send Google user data to your backend
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
                email: user.email,
                full_name: user.displayName,
                profile_photo: user.photoURL,
                google_uid: user.uid,
                signup_type: "g" // 'g' for Google signup
            });

            Swal.fire({
                icon: "success",
                title: "Google Sign Up Successful!",
                text: response?.data?.message,
            });
            navigate("/dashboard");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Google Sign Up Failed",
                text: error.message,
            });
        }
        setIsGoogleLoading(false);
    };

    // to hide the popup
    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsPasswordMatched({ status: true, message: "" });
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [isPasswordMatched.status]);

    return (
        <Wrapper>
            <div className="container">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h1>Register as User</h1>
                {!isPasswordMatched?.status && (
                    <p className="text-[11px] font-semibold text-center text-red-700 bg-red-100 px-1 py-2 mt-4 tracking-wider">
                        both password not matched
                    </p>
                )}

                {/* Google Sign Up Button */}
                <div className="google-btn-container">
                    <button
                        type="button"
                        className="google-btn"
                        onClick={handleGoogleSignUp}
                        disabled={isGoogleLoading}
                    >
                        <FcGoogle className="google-icon" />
                        {isGoogleLoading ? "Processing..." : "Continue with Google"}
                    </button>
                </div>

                <div className="divider">
                    <span>OR</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="row">
                        <label htmlFor="full_name">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            autoComplete="off"
                            placeholder="Enter your full name"
                            {...register("full_name", {
                                required: {
                                    value: true,
                                    message: "Full Name is required",
                                },
                            })}
                        />
                        {errors?.full_name && (
                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                {errors?.full_name?.message}
                            </span>
                        )}
                    </div>
                    <div className="row">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email@example.com"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "A valid email is required",
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Enter a valid email",
                                },
                            })}
                        />
                        {errors?.email && (
                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                {errors?.email?.message}
                            </span>
                        )}
                    </div>
                    <div className="row">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Type Here"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Password is required",
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Password is too long(max 20char)",
                                },
                                minLength: {
                                    value: 8,
                                    message: "Password is too short (min 8char)",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/,
                                    message: "At least one uppercase,one special char and one number",
                                },
                            })}
                        />
                        {errors?.password && (
                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                {errors?.password?.message}
                            </span>
                        )}
                    </div>
                    <div className="row">
                        <label htmlFor="password">Confirm Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Type Here"
                            {...register("confirmPassword", {
                                required: {
                                    value: true,
                                    message: "Password is required",
                                },
                            })}
                        />
                        {errors?.confirmPassword && (
                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                {errors?.confirmPassword?.message}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Register"}
                        </button>
                    </div>
                </form>
                <div className="">
                    <p className="text-center text-[10px] font-semibold opacity-9 mt-3">
                        Already an user.
                        <Link className="ml-1 link" to="/login">
                            Login now
                        </Link>
                    </p>
                </div>
                <div className="flex justify-center">
                    <button type="submit" onClick={() => navigate("/register-recruiter")} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Register as Recruiter"}
                    </button>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    background: #f9faff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    .container {
        background: var(--color-white);
        max-width: 360px;
        width: 100%;
        padding: 58px 44px;
        border: 1px solid #e1e2f0;
        border-radius: 4px;
        box-shadow: 0 0 5px 0 rgba(42, 45, 48, 0.12);
        transition: all 0.3s ease;
    }
    h1 {
        margin-top: 20px;
        text-align: center;
        text-transform: capitalize;
        font-size: calc(1rem + 0.3vw);
        font-weight: 600;
        color: var(--color-primary);
    }
    form {
        margin-top: calc(0.8rem + 0.7vw);
    }

    /* Google Button Styles */
    .google-btn-container {
        margin: 20px 0;
        display: flex;
        justify-content: center;
    }
    .google-btn {
        width: 100%;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: white;
        border: 1px solid #d6d8e6;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .google-btn:hover {
        background: #f8f8f8;
    }
    .google-btn:disabled {
        background: #f0f0f0;
        cursor: not-allowed;
    }
    .google-icon {
        font-size: 18px;
    }

    /* Divider Styles */
    .divider {
        display: flex;
        align-items: center;
        margin: 20px 0;
        color: #777;
        font-size: 12px;
    }
    .divider::before,
    .divider::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #d6d8e6;
    }
    .divider::before {
        margin-right: 10px;
    }
    .divider::after {
        margin-left: 10px;
    }

    .row {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .row label {
        font-size: 12px;
        color: var(--color-black);
        font-weight: 400;
        margin-bottom: 2px;
    }

    .row input {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #d6d8e6;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease-out;
    }

    .row input:focus {
        outline: none;
        box-shadow: inset 2px 2px 5px 0 rgba(42, 45, 48, 0.12);
    }

    .row input::placeholder {
        color: var(--color-black);
        opacity: 0.7;
    }

    button[type="submit"] {
        min-width: 100px;
        padding: 8px;
        font-size: 16px;
        letter-spacing: 1px;
        background: var(--color-accent);
        color: var(--color-white);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin: 15px auto 0;
        transition: background 0.2s ease-out;
    }

    button[type="submit"]:hover {
        background: var(--color-primary);
    }
    button[type="submit"]:disabled {
        background: var(--color-gray);
        color: var(--color-black);
        cursor: not-allowed;
    }

    @media (max-width: 458px) {
        .container {
            width: 90%;
            padding: 30px 0;
        }
        form {
            padding: 0 20px;
        }
    }
    p .link {
        text-transform: capitalize;
        color: var(--color-primary);
    }
    p .link:hover {
        text-decoration: underline;
    }
`;

export default Register;