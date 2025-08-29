//src/pages/RecruiterLogin.jsx
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

const RecruiterLogin = () => {
  const { handleFetchMe, handleGoogleAuthRecruiter } = useUserContext();
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
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login-recruiter`,
        data,
        {
          withCredentials: true,
        }
      );
      const user = response?.data?.user;
      if (user?.role === 3 && user?.ac_status === 2) {
        toast.warning(
          <div>
            Your account is temporarily on hold. <br />
            <a href="#" style={{ color: '#007bff' }}>Click here to activate</a>
          </div>,
          { autoClose: 3000 }
        );
        setIsLoading(false);
        return;
      }
      if (user?.role === 3 && user?.ac_status === 3) {
        toast.error(
          <div>
            Your account has been permanently disabled.<br />
            <a href="#" style={{ color: '#007bff' }}>Click here to appeal</a>
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

      const result = await handleGoogleAuthRecruiter(user);

      if (!result.success) {
        if (result.isBlocked) {
          toast.info(
            <div>
              {result.message}<br />
              <a href="#" style={{ color: '#007bff' }}>Click here to activate your account</a>
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
        <h1>Login as Recruiter</h1>

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

        <div className="divider">
          <span>OR</span>
        </div>

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

        <div className="">
          <p className="text-center text-[10px] font-semibold opacity-9 mt-3">
            New as a Recruiter.
            <Link className="ml-1 link" to="/register-recruiter">
              Create account
            </Link>
          </p>
        </div>
        <div className="alternate-login">
          <button
            type="button"
            className="user-btn"
            onClick={() => navigate("/login")}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login as User"}
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
    font-size: 26px;
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

export default RecruiterLogin;