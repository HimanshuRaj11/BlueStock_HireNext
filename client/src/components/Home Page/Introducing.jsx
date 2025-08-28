'use client';
import React, { useEffect } from 'react';

export default function Introducing() {
  // Dynamically load the web component once (only on client)
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    document.head.appendChild(script);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-10 mb-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 md:px-6 py-6 flex flex-col md:flex-row items-center gap-8 md:gap-6 overflow-hidden">

        {/* Left: Lottie Animation */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <dotlottie-wc
              src="https://lottie.host/d00645b5-1dfa-40a8-8e67-e246aa8a4c26/l0JASxQWXC.lottie"
              style={{ width: '100%', height: '230px' }}
              autoplay
              loop
              speed="1"
            ></dotlottie-wc>
          </div>
        </div>

        {/* Right: Content Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-black">
              Introducing a career platform for college students & fresh grads
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Explore contests, webinars, take aptitude test, prepare for your dream career & find jobs & internships.
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {["Expert speak", "Contests", "NCAT", "Pathfinder", "Jobs & Internships"].map((item, idx) => (
              <span
                key={idx}
                className="text-sm font-medium px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:shadow-sm cursor-pointer transition"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="w-full md:w-auto">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2 rounded-full w-full md:w-auto">
              Explore now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
