import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "../context/UserContext";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../utils/googleAuth";
import CookieConsentBanner from "./CookieConsentBanner";

const Login = () => {
    const { handleFetchMe, handleGoogleAuth } = useUserContext();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                data,
                {
                    withCredentials: true,
                }
            );
            const user = response?.data?.user;
            if (user?.role === 3 && user?.ac_status === 2) {
                toast.warning(
                    <div>
                        Your account is temporarily on hold. <br/>
                        <a href="#" style={{color: '#007bff'}}>Click here to activate</a>
                    </div>,
                    { autoClose: 3000 }
                );
                setIsLoading(false);
                return;
            }
            if (user?.role === 3 && user?.ac_status === 3) {
                toast.error(
                    <div>
                        Your account has been permanently disabled.<br/>
                        <a href="#" style={{color: '#007bff'}}>Click here to appeal</a>
                    </div>,
                    { autoClose: 10000 }
                );
                setIsLoading(false);
                return;
            }
            toast.success(response?.data?.message);
            handleFetchMe();
            reset();
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error?.response?.data);
        }
        setIsLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const { user, error } = await signInWithGoogle();
            if (error) throw new Error(error.message);

            const result = await handleGoogleAuth(user);

            if (!result.success) {
                if (result.isBlocked) {
                    toast.info(
                        <div>
                            {result.message}<br/>
                            <a href="#" style={{color: '#007bff'}}>Click here to activate your account</a>
                        </div>,
                        { autoClose: 10000 }
                    );
                } else {
                    toast.error(result.message);
                }
                return;
            }

            toast.success(result?.message);
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message);
        }
        setIsGoogleLoading(false);
    };

    return (
        <Wrapper>
            <ToastContainer 
                position="top-center"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="container">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h1>Login as User</h1>
                
                {/* Google Sign In Button */}
                <div className="google-btn-container">
                    <button 
                        type="button" 
                        className="google-btn"
                        onClick={handleGoogleSignIn}
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
                            })}
                        />
                        {errors?.password && (
                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                {errors?.password?.message}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    </div>
                </form>
                <div className="">
                    <p className="text-center text-[10px] font-semibold opacity-9 mt-3">
                        New as an User.
                        <Link className="ml-1 link" to="/register">
                            Create account
                        </Link>
                    </p>
                </div>
                <div className="flex justify-center">
                    <button type="submit" onClick={() => navigate("/login-recruiter")} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Login as Recruiter"}
                    </button>
                </div>
            </div>
            <CookieConsentBanner />
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
        font-size: calc(1rem + 0.5vw);
        font-weight: 600;
        color: var(--color-primary);
    }
    form {
        margin-top: calc(1rem + 0.9vw);
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
        min-width: 90px;
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

export default Login;