import React from "react";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

const BottomNav = () => {
    const { user } = useUserContext();
    const profilePhoto = user?.profile_photo;

    if (!user?.ac_status) return null;

    const isAdmin = user?.role === 1;
    const isRecruiter = user?.role === 2;
    const isRecruiterOrUser = user?.role === 2 || user?.role === 3;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg flex justify-around items-center py-2 sm:hidden">
            {/* Home */}
            <NavLink
                to="/"
                className={({ isActive }) =>
                    "flex flex-col items-center text-sm " +
                    (isActive ? "text-blue-600" : "text-gray-500")
                }
                end
            >
                <ion-icon name="home-outline" style={{ fontSize: "24px" }}></ion-icon>
                Home
            </NavLink>

            {/* Jobs */}
            <NavLink
                to="/dashboard/all-jobs"
                className={({ isActive }) =>
                    "flex flex-col items-center text-sm " +
                    (isActive ? "text-blue-600" : "text-gray-500")
                }
            >
                <ion-icon name="briefcase-outline" style={{ fontSize: "24px" }}></ion-icon>
                Jobs
            </NavLink>

            {/* Applications (Recruiter or User) */}
            {isRecruiterOrUser && (
                <NavLink
                    to="/dashboard/my-jobs"
                    className={({ isActive }) =>
                        "flex flex-col items-center text-sm " +
                        (isActive ? "text-blue-600" : "text-gray-500")
                    }
                >
                    <ion-icon name="apps-outline" style={{ fontSize: "24px" }}></ion-icon>
                    Applications
                </NavLink>
            )}

            {/* Manage (Only Recruiter) */}
            {isRecruiter && (
                <NavLink
                    to="/dashboard/manage-jobs"
                    className={({ isActive }) =>
                        "flex flex-col items-center text-sm " +
                        (isActive ? "text-blue-600" : "text-gray-500")
                    }
                >
                    <ion-icon name="settings-outline" style={{ fontSize: "24px" }}></ion-icon>
                    Manage
                </NavLink>
            )}

            {/* Admin Links */}
            {isAdmin && (
                <>
                    <NavLink
                        to="/dashboard/admin"
                        className={({ isActive }) =>
                            "flex flex-col items-center text-sm " +
                            (isActive ? "text-blue-600" : "text-gray-500")
                        }
                    >
                        <ion-icon name="shield-outline" style={{ fontSize: "24px" }}></ion-icon>
                        Info
                    </NavLink>

                    <NavLink
                        to="/dashboard/stats"
                        className={({ isActive }) =>
                            "flex flex-col items-center text-sm " +
                            (isActive ? "text-blue-600" : "text-gray-500")
                        }
                    >
                        <ion-icon name="stats-chart-outline" style={{ fontSize: "24px" }}></ion-icon>
                        Stats
                    </NavLink>
                </>
            )}

            {/* Profile */}
            <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                    "flex flex-col items-center text-sm " +
                    (isActive ? "text-blue-600" : "text-gray-500")
                }
            >
                {profilePhoto ? (
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-6 h-6 rounded-full"
                    />
                ) : (
                    <ion-icon name="person-outline" style={{ fontSize: "24px" }}></ion-icon>
                )}
                Profile
            </NavLink>
        </div>
    );
};

export default BottomNav;