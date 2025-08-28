import React from 'react';
import './Brands.css'; // Contains keyframes and animation classes

const logos = [
  "/p1.png", "/p2.png", "/p3.png", "/p4.png", "/p5.png",
  "/p6.png", "/p7.png", "/p8.png", "/p9.png", "/p10.png",
  "/p11.png", "/p12.png", "/p13.png", "/p14.png", "/p15.png"
  ,"/p16.png","/p17.png", "/p18.png", "/p19.png","/p20.png",
  "/p21.png", "/p22.png", "/p23.png","/p24.png"
];
 
// Shuffle helper
const shuffleLogos = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Brands() {
  return (
    <div className="bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="md:text-2xl text-xl font-semibold mb-6 text-center">
          2500+ recruiters have used HireNext to close more than 12000+ positions
        </h2>

        {/* Desktop view */}
        <div className="hidden md:block mt-10 space-y-1">
          {[0, 1, 2].map((row) => {
            const rowLogos = shuffleLogos([...logos,...logos]);

            return (
              <div key={row} className="logo-scroll-wrapper">
                <div
                  className="flex gap-6 animate-scroll-ltr-desktop-smooth w-max"
                  style={{ marginLeft: row % 2 === 0 ? '0px' : '65px' }}
                >
                  {rowLogos.map((logo, index) => (
                    <div
                      key={`desktop-${row}-${index}`}
                      className="bg-white p-2 rounded-lg shadow-md-custom flex items-center justify-center"
                      style={{
                        minWidth: "auto",
                        maxWidth: "140px",
                        height: "auto"
                      }}
                    >
                      <img
                        src={logo}
                        alt={`Logo ${index}`}
                        className="max-h-[60px] w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile view */}
        <div className="block md:hidden mt-10 space-y-2">
          {[0, 1, 2, 3, 4].map((row) => {
            const shuffled = shuffleLogos([...logos,...logos]);

            return (
              <div key={row} className="logo-scroll-wrapper">
                <div
                  className={`flex gap-5 w-max animate-scroll-ltr-slow ${
                    row % 2 !== 0 ? "flex-row-reverse" : ""
                  }`}
                  style={{ marginLeft: row % 2 === 0 ? '0px' : '65px' }}
                >
                  {shuffled.map((logo, index) => (
                    <div
                      key={`${row}-${index}`}
                      className="bg-white p-2 rounded-lg shadow-md-custom flex items-center justify-center"
                      style={{
                        minWidth: "auto",
                        maxWidth: "140px",
                        height: "auto"
                      }}
                    >
                      <img
                        src={logo}
                        alt={`Logo ${index}`}
                        className="max-h-[60px] w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}