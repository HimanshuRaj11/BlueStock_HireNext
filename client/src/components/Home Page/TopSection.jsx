import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

export default function TopSection({ showEmployerDropdown, setShowEmployerDropdown }) {
  return (
    <section className="bg-gradient-to-b from-[#f8f8fc] to-white py-12 text-center relative">
      {/* Heading */}
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 pt-4">
        Find your dream job now
      </h1>
      <p className="text-gray-500 text-sm sm:text-base font-semibold mb-6">
        5 lakh+ jobs for you to explore
      </p>

      {/* Search Bar */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center px-4 py-4 gap-4 sm:gap-0">
          {/* Skill / Designation / Company Input */}
          <div className="flex items-center gap-2 w-full sm:flex-[0.5]">
            <FaSearch className="text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Enter skills / designations / companies"
              className="w-full outline-none text-gray-600 text-sm placeholder:text-gray-400 bg-transparent"
            />
          </div>

          {/* Divider - Desktop Only */}
          <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2" />

          {/* Experience Selector */}
          <div className="flex items-center gap-1 text-gray-500 text-sm cursor-pointer w-full sm:flex-[0.3]">
            <span>Select experience</span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Divider - Desktop Only */}
          <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2" />

          {/* Location Input */}
          <div className="w-full sm:flex-[0.3]">
            <input
              type="text"
              placeholder="Enter location"
              className="w-full outline-none text-gray-600 text-sm placeholder:text-gray-400 bg-transparent"
            />
          </div>

          {/* Search Button */}
          <div className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-full">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}