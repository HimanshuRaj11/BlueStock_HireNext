import React, { useEffect, useRef, useState } from "react";
import Wrapper from "../assets/css/wrappers/LandingPage";
import Navbar from "../components/shared/Navbar";
import Brands from "../components/Home Page/Brands";
import CookieConsentBanner from "./CookieConsentBanner";
import Categories from "../components/Home Page/Categories";
import FeaturedCompanies from "../components/Home Page/FeaturedCompanies";
import TopSection from "../components/Home Page/TopSection";
import Introducing from "../components/Home Page/Introducing";
import BottomNav from "../components/shared/BottomNav";
import { useUserContext } from "../context/UserContext";
import Footer from "./Footer";

const Landing = () => {
    const navbarRef = useRef(null);
    const heroRef = useRef(null);
    const { user } = useUserContext();
    const [showEmployerDropdown, setShowEmployerDropdown] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showEmployerDropdown && !e.target.closest('.employer-dropdown-wrapper')) {
                setShowEmployerDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmployerDropdown]);

    useEffect(() => {
        const navbarHeight = navbarRef.current.getBoundingClientRect().height;
    }, []);

    return (
        <>
            <div>
                <Navbar navbarRef={navbarRef} />
                
                <Wrapper ref={heroRef}>
                    {user?.ac_status && user?.role === 3 && <BottomNav />}
                </Wrapper>
                
                <TopSection 
                    showEmployerDropdown={showEmployerDropdown}
                    setShowEmployerDropdown={setShowEmployerDropdown}
                />
                <Introducing/>
                <Categories />
                <FeaturedCompanies />
                <Brands />
            </div>
            <Footer />
            <CookieConsentBanner />
        </>
    );
};

export default Landing;