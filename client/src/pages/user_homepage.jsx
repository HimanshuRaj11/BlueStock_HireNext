import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Avatar, Card, CardContent, Typography, Button, Box } from "@mui/material";
import avatar from "../assets/media/avatar.jpg";
import axios from "axios";
import styled from "styled-components";
import calculateProfileCompletion from "../utils/profileCompletion";

dayjs.extend(relativeTime);

const UserHomePage = () => {
  const { user } = useUserContext();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [profileData, setProfileData] = useState({
    education: [],
    certificates: [],
    projects: [],
    skills: [],
    about: "",
    social_links: {},
    full_address: "",
    workExperiences: [],
    userProfile: null,
    recruiterProfile: null
  });

  const getProgressColor = (value) => {
    if (value <= 10) return '#f44336';
    if (value <= 60) return '#ff9800';
    return '#4caf50';
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (!user) return;

        let promises = [];
        promises.push(
          axios.get(`{import.meta.env.VITE_API_BASE_URL}/api/user-profile/skills`,
            { withCredentials: true })
            .then(res => {
              return { skills: res.data.skills || res.data || [] };
            })
            .catch(() => {
              return { skills: [] };
            })
        );

        if (user.role === 3) {
          promises = promises.concat([
            axios.get(`{import.meta.env.VITE_API_BASE_URL}/api/user-profile`,
              { withCredentials: true })
              .then(res => {
                return {
                  userProfile: res.data,
                  about: res.data.about || "",
                  full_address: res.data.full_address || "",
                  social_links: res.data.social_links || {}
                };
              })
              .catch(() => {
                return {};
              }),
            axios.get(`{import.meta.env.VITE_API_BASE_URL}/api/education`,
              { withCredentials: true })
              .then(res => {
                return { education: res.data.result || res.data || [] };
              })
              .catch(() => {
                return { education: [] };
              }),
            axios.get(`{import.meta.env.VITE_API_BASE_URL}/api/work-experience`,
              { withCredentials: true })
              .then(res => {
                return { workExperiences: res.data.result || res.data || [] };
              })
              .catch(() => {
                return { workExperiences: [] };
              }),
            axios.get(`{import.meta.env.VITE_API_BASE_URL}/api/certificates`,
              { withCredentials: true })
              .then(res => {
                return { certificates: res.data.result || res.data || [] };
              })
              .catch(() => {
                return { certificates: [] };
              }),
            axios.get(`{import.meta.env.VITE_API_BASE_URL}/api/projects`,
              { withCredentials: true })
              .then(res => {
                return { projects: res.data.result || res.data || [] };
              })
              .catch(() => {
                return { projects: [] };
              })
          ]);
        } else if (user.role === 2) {
          promises.push(
            axios.get(`{import.meta.env.VITE_API_BASE_URL}/api/recruiter-profile`,
              { withCredentials: true })
              .then(res => {
                return { recruiterProfile: res.data };
              })
              .catch(() => {
                return {};
              })
          );
        }

        const results = await Promise.all(promises);
        const mergedData = results.reduce((acc, curr) => {
          const normalized = {};
          Object.keys(curr).forEach(key => {
            normalized[key] = curr[key]?.result || curr[key];
          });
          return { ...acc, ...normalized };
        }, {});

        setProfileData(prev => ({ ...prev, ...mergedData }));

      } catch (error) {
        console.error("Error in fetchAllData:", error);
      }
    };

    fetchAllData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const completion = calculateProfileCompletion(user, profileData);
    setProfileCompletion(completion);

    if (user?.updated_at) {
      setLastUpdated(dayjs(user.updated_at).fromNow());
    }
  }, [user, profileData]);

  const progressColor = getProgressColor(profileCompletion);

  return (
    <Wrapper progressColor={progressColor} profileCompletion={profileCompletion}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="circle-container">
                <div className="circle">
                  <div className="inner-circle">
                    {user?.profile_photo ? (
                      <img
                        src={user.profile_photo}
                        alt="Profile"
                        className="profile-img"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <div style={{ fontSize: "20px", fontWeight: "bold" }}>+</div>
                        <div>Add photo</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="percentage-label">{profileCompletion}%</div>
              </div>

              <div className="flex-1">
                <h2 className="text-base font-semibold mb-1">{user?.full_name || "User"}</h2>
                <p className="text-sm text-gray-500 mb-1">
                  Updated {lastUpdated || "recently"}
                </p>
                <Link
                  to={`/dashboard/edit-profile/${user?.id}`}
                  className="text-blue-600 font-semibold text-sm hover:text-blue-600"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: 'Poppins', sans-serif;

  .circle-container {
    position: relative;
    width: 96px;
    height: 96px;
    flex-shrink: 0;
  }

  .circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      ${({ progressColor, profileCompletion }) =>
    `${progressColor} ${profileCompletion * 3.6}deg, #e0e0e0 ${profileCompletion * 3.6}deg`}
    );
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inner-circle {
    background: #fff;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-img,
  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #777;
    background-color: #f0f0f0;
    font-weight: 500;
    font-size: 16px;
    flex-direction: column;
    text-align: center;
  }

  .percentage-label {
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    padding: 2px 10px;
    border-radius: 20px;
    border: 1px solid ${({ progressColor }) => progressColor};
    font-size: 13px;
    font-weight: 500;
    color: ${({ progressColor }) => progressColor};
  }
`;

export default UserHomePage;