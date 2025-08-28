import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
      setTimeout(() => setIsVisible(true), 50);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    
    setIsVisible(false);
    
    setTimeout(() => {
      setShowBanner(false);
      // Enable third-party cookies by making a test request
      enableThirdPartyCookies();
    }, 300);
  };

  const enableThirdPartyCookies = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/cookie-test", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.log("Cookie test completed (even if error, it helps establish cookie acceptance)");
    }
  };

  if (!showBanner) return null;

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 
      flex flex-col md:flex-row justify-between items-center z-50
      transform transition-transform duration-300 ease-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <p className="text-sm mb-2 md:mb-0 md:mr-4">
        This site uses cookies to deliver services, personalize information, and improve user experience. 
        By continuing to use the site, you agree to our{" "}
        <a href="/privacy" className="underline">Privacy Policy</a> and{" "}
        <a href="/terms" className="underline">Terms of Use</a>.
      </p>
      <button
        onClick={handleAccept}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap
               transition-colors duration-200"
      >
        Ok, Continue
      </button>
    </div>
  );
};

export default CookieConsentBanner;