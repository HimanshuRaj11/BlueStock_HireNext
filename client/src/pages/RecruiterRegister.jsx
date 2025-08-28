import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../utils/googleAuth";

const RecruiterRegister = () => {
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
                    "http://localhost:3000/api/auth/register-recruiter",
                    user
                );

                Swal.fire({
                    icon: "success",
                    title: "Hurray...",
                    text: response?.data?.message,
                });
                reset();
                navigate("/login-recruiter");
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
            const response = await axios.post("http://localhost:3000/api/auth/google-recruiter", {
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
                <h1>Register as Recruiter</h1>
                {!isPasswordMatched?.status && (
                    <p className="text-[11px] font-semibold text-center text-red-700 bg-red-100 px-1 py-2 mt-4 tracking-wider">
                        both password not matched
                    </p>
                )}

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
                <div className="divider">
                    <span>OR</span>
                </div>

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
                <div className="">
                    <p className="text-center text-[10px] font-semibold opacity-9 mt-3">
                        Already a recruiter.
                        <Link className="ml-1 link" to="/login-recruiter">
                            Login now
                        </Link>
                    </p>
                </div>
                <div className="alternate-register">
                    <button 
                        type="button" 
                        className="user-btn" 
                        onClick={() => navigate("/register")} 
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Register as User"}
                    </button>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  .container {
    background: #ADD8E6;
    width: 100%;
    max-width: 440px;
    padding: 48px 36px;
    border-radius: 12px;
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  h1 {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    color: #1d1f2b;
  }

  .google-btn-container {
    width: 100%;
  }

  .google-btn {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    font-weight: 500;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .google-btn:hover {
    background-color: #f5f5f5;
  }

  .google-btn:disabled {
    background-color: #fafafa;
    cursor: not-allowed;
  }

  .google-icon {
    font-size: 18px;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 13px;
    position: relative;
  }

  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #e0e0e0;
  }

  .divider::before {
    margin-right: 12px;
  }

  .divider::after {
    margin-left: 12px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .row label {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .row input {
    padding: 10px 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    transition: border 0.3s ease;
  }

  .row input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
  }

  .row input::placeholder {
    color: #aaa;
  }

  .error-text {
    font-size: 12px;
    color: #d32f2f;
    font-weight: 500;
    margin-top: -10px;
    padding-left: 2px;
  }

  button[type="submit"],
  .user-btn {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    font-weight: 600;
    background-color:var(--color-accent);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  button[type="submit"]:hover,
  .user-btn:hover {
    background-color: #4178c0;
  }

  button:disabled {
    background-color: #c4c4c4;
    cursor: not-allowed;
  }

  .alt-actions {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #666;
    margin-top: 10px;
  }

  .link {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 500;
  }

  .link:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .container {
      padding: 36px 24px;
    }
  }
`;

export default RecruiterRegister;