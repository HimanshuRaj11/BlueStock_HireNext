import React from "react";
import { 
  IoIosStats, 
  IoMdHelpCircle,
  IoMdDocument,
  IoMdPeople,
  IoMdSchool,
  IoMdInformationCircle
} from "react-icons/io";
import { FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { 
  RiMenuAddFill, 
  RiShareBoxLine,
  RiCoinsLine
} from "react-icons/ri";
import { 
  FiUser, 
} from "react-icons/fi";
import { 
  FaUserShield, 
  FaBriefcase, 
  FaUsers,
  FaLock,
  FaFileContract
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { MdWorkOutline } from "react-icons/md";

// Common links for all user types
const CommonLinks = [
  {
    text: "Referrals",
    path: "referrals",
    icon: <RiShareBoxLine />,
  },
  {
    text: "Courses",
    path: "courses",
    icon: <IoMdSchool />,
  },
  {
    text: "Certificates",
    path: "certificates",
    icon: <IoMdDocument />,
  },
  {
    text: "HireNext Coins",
    path: "coins",
    icon: <RiCoinsLine />,
  },
  {
    text: "Support",
    path: "support",
    icon: <IoMdHelpCircle />,
  },
  {
    text: "Privacy Policy",
    path: "privacy-policy",
    icon: <FaLock />,
  },
  {
    text: "Terms of use",
    path: "terms",
    icon: <FaFileContract />,
  },
  {
    text: "Disclaimer Disclosure",
    path: "disclaimer",
    icon: <IoMdInformationCircle />,
  },
  {
    text: "About us",
    path: "about",
    icon: <IoMdPeople />,
  },
  {
    text: "Settings",
    path: "settings",
    icon: <FiSettings />,
  },
  {
    text: "FAQs",
    path: "faqs",
    icon: <FiHelpCircle />,
  },
  {
    text: "Logout",
    key: "logout",
    icon: <FiLogOut className="logout-icon" />,
  }
];

const AdminLinks = [
  {
    text: "profile",
    path: ".",
    icon: <FiUser />,
  },
  {
    text: "All Jobs",
    path: "all-jobs",
    icon: <MdWorkOutline />
  },
  {
    text: "stats",
    path: "stats",
    icon: <IoIosStats />,
  },
  {
    text: "admin",
    path: "admin",
    icon: <FaUserShield />,
  },
  {
    text: "manage jobs (admin)",
    path: "manage-jobs-admin",
    icon: <FaBriefcase />,
  },
  {
    text: "manage users",
    path: "manage-users",
    icon: <FaUsers />,
  },
  ...CommonLinks
];

const RecruiterLinks = [
  {
    text: "profile",
    path: ".",
    icon: <FiUser />,
  },
  {
    text: "All Jobs",
    path: "all-jobs",
    icon: <MdWorkOutline />
  },
  {
    text: "add job",
    path: "add-jobs",
    icon: <RiMenuAddFill />,
  },
  {
    text: "manage jobs",
    path: "manage-jobs",
    icon: <MdManageAccounts />,
  },
  {
    text: "Applications",
    path: "my-jobs",
    icon: <FaBriefcase />,
  },
  ...CommonLinks
];

const UserLinks = [
  {
    text: "profile",
    path: ".",
    icon: <FiUser />,
  },
  {
    text: "All Jobs",
    path: "all-jobs",
    icon: <MdWorkOutline />
  },
  {
    text: "Applications",
    path: "my-jobs",
    icon: <FaBriefcase />,
  },
  ...CommonLinks
];

export { CommonLinks, AdminLinks, RecruiterLinks, UserLinks };