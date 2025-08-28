import React, { useRef } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ltc from '../../assets/media/LandingPage/ltc.png';
import genpact from '../../assets/media/LandingPage/gen.png';
import rel from '../../assets/media/LandingPage/rel.png';
import card from '../../assets/media/LandingPage/card.png';
import tcs from '../../assets/media/LandingPage/tcs.png';
import icici from '../../assets/media/LandingPage/icici.png';
import infosys from '../../assets/media/LandingPage/infosys.png';
import empower from '../../assets/media/LandingPage/emp.png';
import amgen from '../../assets/media/LandingPage/Amgen.png';
import cap from '../../assets/media/LandingPage/cap.png';

const companies = [
  {
    id: 1, company: "Lloyds Technology Centre", followers: "21.4K+ jobs", icon: ltc, reviews: "4.2",
    about: "A tech and data company.", tint: "#E0F7F6"
  },
  {
    id: 2, company: "Genpact", followers: "84K+ jobs", icon: genpact, reviews: "3.8",
    about: "Global professional services firm.", tint: "#F3F8FF"
  },
  {
    id: 3, company: "Reliance Retail", followers: "22K+ jobs", icon: rel, reviews: "3.9",
    about: "India's largest retail company.", tint: "#FDF6ED"
  },
  {
    id: 4, company: "Cardinal Health", followers: "4.5K+ jobs", icon: card, reviews: "4.0",
    about: "Together let's pursue even better.", tint: "#FFF2F2"
  },
  {
    id: 5, company: "Tata Consultancy Services", followers: "239 jobs", icon: tcs, reviews: "4.3",
    about: "Leading global IT services firm.", tint: "#EEF7FF"
  },
  {
    id: 6, company: "ICICI Bank", followers: "19.7K+ jobs", icon: icici, reviews: "3.7",
    about: "Major Indian banking and finance company.", tint: "#F7F3FF"
  },
  {
    id: 8, company: "Infosys", followers: "7.8K+ jobs", icon: infosys, reviews: "4.1",
    about: "Digital services and consulting giant.", tint: "#F0FAF2"
  },
  {
    id: 9, company: "Empower", followers: "3.9K+ jobs", icon: empower, reviews: "3.9",
    about: "Financial wellness platform.", tint: "#FFF7E0"
  },
  {
    id: 10, company: "Amgen INC", followers: "37.7K+ jobs", icon: amgen, reviews: "4.0",
    about: "Pioneering biotech innovation.", tint: "#E8F4F8"
  },
  {
    id: 11, company: "Capgemini", followers: "37.7K+ jobs", icon: cap, reviews: "4.0",
    about: "Business transformation & tech.", tint: "#EAF6F1"
  },
];

const FeaturedCompanies = () => {
  const scrollContainer = useRef(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto md:px-12 px-6 mb-20 relative">
      <h2 className="md:text-2xl text-xl font-semibold mb-6 text-center">
        Featured Companies Actively Hiring
      </h2>

      <div className="relative">
        {/* Left arrow - visible on desktop only */}
        <button 
          onClick={scrollLeft}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition duration-200"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-blue-600 text-lg" />
        </button>

        {/* Right arrow - visible on desktop only */}
        <button 
          onClick={scrollRight}
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition duration-200"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-blue-600 text-lg" />
        </button>

        <div 
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
        >
          {companies.map(({ id, company, followers, icon, about, reviews, tint }) => (
            <div
              key={id}
              className="w-[240px] h-[300px] flex-shrink-0 rounded-2xl border border-gray-200 shadow-sm bg-white flex flex-col relative hover:-translate-y-1 hover:shadow-lg transition duration-200"
            >
              <div className="mt-12 absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm z-1">
                <img src={icon} alt={company} className="w-17 h-17 object-contain bg-transparent" />
              </div>

              <div className="h-[80px] w-full rounded-t-2xl" style={{ backgroundColor: tint }}></div>

              <div className="px-4 pt-6 pb-4 flex flex-col text-center flex-grow mt-2">
                <div className="bg-gray-100 px-3 py-2 rounded-lg mb-2">
                  <h3 className="text-sm font-semibold text-[#18191C] min-h-[40px] leading-tight">
                    {company}
                  </h3>
                  <div className="flex justify-center items-center gap-1 text-sm text-gray-600 mt-1">
                    <FaStar className="text-yellow-500 text-xs" />
                    <span>{reviews}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{followers}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">{about}</p>
                <div className="mt-auto pt-3">
                  <button className="bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-full hover:bg-blue-100 transition text-sm">
                    View jobs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 hover:shadow-sm transition duration-200">
          View All Companies
        </button>
      </div>
    </div>
  );
};

export default FeaturedCompanies;