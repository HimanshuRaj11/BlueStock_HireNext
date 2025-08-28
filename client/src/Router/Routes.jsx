import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../Layout/HomeLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import {
    Register,
    Login,
    RecruiterLogin,
    RecruiterRegister,
    Landing,
    Error,
    AllJobs,
    Stats,
    Profile,
    Admin,
    EditJob,
    AddJob,
    ManageJobs,
    Job,
    MyJobs,
    EditProfile,
    ManageUsers,
    AdminManageJobs,
    UserHomePage,
    AdminHomePage,
    RecruiterHomePage,
    Notifications,
    Settings,
    FAQs,
    AboutUs,
    Certificates,
    Courses,
    DisclaimerDisclosure,
    HireNextCoins,
    PrivacyPolicy,
    Referrals,
    Support,
    TermsOfUse
} from "../pages";

import { JobContext } from "../context/JobContext";
import CommonProtectRoute from "../components/shared/CommonProtectRoute";
import ProtectAdminRoute from "../components/shared/ProtectAdminRoute";
import RecruiterRoute from "../components/shared/RecruiterRoute";
import HomeRoleRedirect from "../pages/HomeRoleRedirect";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <HomeRoleRedirect />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "login-recruiter",
                element: <RecruiterLogin />,
            },
            {
                path: "register-recruiter",
                element: <RecruiterRegister />,
            },
            {
                path: "user-home",
                element: <UserHomePage />,
            },
            {
                path: "admin-home",
                element: <AdminHomePage />,
            },
            {
                path: "recruiter-home",
                element: <RecruiterHomePage />,
            },
            {
                path: "dashboard",
                element: (
                    <CommonProtectRoute>
                        <JobContext>
                            <DashboardLayout />
                        </JobContext>
                    </CommonProtectRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Profile />,
                    },
                    {
                        path: "settings",
                        element: <Settings />,
                    },
                    {
                        path: "faqs",
                        element: <FAQs />,
                    },
                    {
                        path: "notifications",
                        element: <Notifications />,
                    },
                    {
                        path: "about",
                        element: <AboutUs />,
                    },
                    {
                        path: "certificates",
                        element: <Certificates />,
                    },
                    {
                        path: "courses",
                        element: <Courses />,
                    },
                    {
                        path: "disclaimer",
                        element: <DisclaimerDisclosure />,
                    },
                    {
                        path: "coins",
                        element: <HireNextCoins />,
                    },
                    {
                        path: "privacy-policy",
                        element: <PrivacyPolicy />,
                    },
                    {
                        path: "referrals",
                        element: <Referrals />,
                    },
                    {
                        path: "support",
                        element: <Support />,
                    },
                    {
                        path: "terms",
                        element: <TermsOfUse />,
                    },
                    {
                        path: "all-jobs",
                        element: (
                            <CommonProtectRoute>
                                <JobContext>
                                    <AllJobs />
                                </JobContext>
                            </CommonProtectRoute>
                        ),
                    },
                    {
                        path: "job/:id",
                        element: (
                            <CommonProtectRoute>
                                <JobContext>
                                    <Job />
                                </JobContext>
                            </CommonProtectRoute>
                        ),
                    },
                    {
                        path: "edit-profile/:id",
                        element: <EditProfile />,
                    },
                    {
                        path: "stats",
                        element: (
                            <ProtectAdminRoute>
                                <Stats />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "add-jobs",
                        element: (
                            <RecruiterRoute>
                                <AddJob />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-jobs",
                        element: (
                            <RecruiterRoute>
                                <ManageJobs />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-jobs-admin",
                        element: (
                            <ProtectAdminRoute>
                                <AdminManageJobs />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "manage-users",
                        element: (
                            <ProtectAdminRoute>
                                <ManageUsers />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "admin",
                        element: (
                            <ProtectAdminRoute>
                                <Admin />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "edit-job/:id",
                        element: (
                            <RecruiterRoute>
                                <EditJob />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "my-jobs",
                        element: (
                            <CommonProtectRoute>
                                <MyJobs />
                            </CommonProtectRoute>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;