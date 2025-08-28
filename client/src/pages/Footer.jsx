import PropTypes from "prop-types"
import React, { useEffect, useRef, useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [isMobile, setIsMobile] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    resources: false,
    company: false,
    quickLinks: false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Assuming 768px is your breakpoint for mobile
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const contactInfo = {
    phone: "+012 (345) 678 99",
    description: "Sed ut perspiciatis undmnis is iste natus error sit amet voluptatem totam rem aperiam.",
    logo: {
      light: "/assets/media/logo.png",
      dark: "https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg",
    },
  }

  const links = {
    resources: [
      { label: "Support", href: "#" },
      { label: "Send feedback", href: "#" },
      { label: "Recruiter Login", href: "#" },
      { label: "Company Login", href: "#" },
      { label: "User Login", href: "#" },
    ],
    company: [
      { label: "Contact us", href: "#" },
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Html Sitemap", href: "#" },
      { label: "XML Sitemap", href: "#" },
    ],
    quickLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms and Conditions", href: "#" },
      { label: "Fraud alert", href: "#" },
      { label: "Trust & Safety", href: "#" },
    ],
  }

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ]

  // Business logos data
  const businessLogos = [
    { id: 1, src: "/p1.png", alt: "Business 1" },
    { id: 2, src: "/p2.png", alt: "Business 2" },
    { id: 3, src: "/p3.png", alt: "Business 3" },
    { id: 4, src: "/p4.png", alt: "Business 4" },
    { id: 5, src: "/p5.png", alt: "Business 5" },
  ]

  // Create ref for the scrolling container
  const logosContainerRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const container = logosContainerRef.current
    let position = 0
    const scrollSpeed = 1 // pixels per frame

    const animate = () => {
      position -= scrollSpeed
      
      // Reset position when we've scrolled one full width
      if (Math.abs(position) >= container.scrollWidth / 2) {
        position = 0
      }
      
      container.style.transform = `translateX(${position}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <footer className="bg-gray-50 pt-12 pb-8">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-6 lg:gap-y-0 gap-x-4 sm:gap-x-6 lg:gap-x-12 mb-16">
          
          {/* Company Logo and Social Links */}
          <div className="lg:col-span-1">
            {/* Company Logo */}
            <div className="mb-8">
              <a href="/" className="inline-block mb-8">
                <img
                  src="/logo-main.webp"
                  alt="Company Logo"
                  className="h-10 dark:hidden"
                />
                <img
                  src="/logo-main.webp"
                  alt="Company Logo"
                  className="hidden h-10 dark:block"
                />
              </a>
            </div>

            {/* Connect with us section */}
            <div>
              <h4 className="text-gray-800 mb-4 text-sm font-medium">Connect with us</h4>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social, index) => (
                  <SocialLink key={index} href={social.href} name={social.name} icon={social.icon} />
                ))}
              </div>
            </div>
          </div>

          {/* Link Sections */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {/* Resources Section */}
            <div className="border-b sm:border-b-0 border-gray-200 pb-3 sm:pb-0">
              <div
                className="flex justify-between items-center cursor-pointer sm:cursor-auto"
                onClick={() => isMobile && toggleSection('resources')}
              >
                <h4 className="text-gray-800 font-medium text-sm mb-2 sm:mb-6">Resources</h4>
                {isMobile && (
                  <span className="text-gray-500 text-lg sm:hidden">
                    {expandedSections.resources ? '−' : '+'}
                  </span>
                )}
              </div>
              <div className={isMobile && !expandedSections.resources ? 'hidden sm:block' : ''}>
                <ul className="space-y-3">
                  {links.resources.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Company Section */}
            <div className="border-b sm:border-b-0 border-gray-200 pb-3 sm:pb-0">
              <div
                className="flex justify-between items-center cursor-pointer sm:cursor-auto"
                onClick={() => isMobile && toggleSection('company')}
              >
                <h4 className="text-gray-800 font-medium text-sm mb-2 sm:mb-6">Company</h4>
                {isMobile && (
                  <span className="text-gray-500 text-lg sm:hidden">
                    {expandedSections.company ? '−' : '+'}
                  </span>
                )}
              </div>
              <div className={isMobile && !expandedSections.company ? 'hidden sm:block' : ''}>
                <ul className="space-y-3">
                  {links.company.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="border-b sm:border-b-0 border-gray-200 pb-3 sm:pb-0">
              <div
                className="flex justify-between items-center cursor-pointer sm:cursor-auto"
                onClick={() => isMobile && toggleSection('quickLinks')}
              >
                <h4 className="text-gray-800 font-medium text-sm mb-2 sm:mb-6">Quick Links</h4>
                {isMobile && (
                  <span className="text-gray-500 text-lg sm:hidden">
                    {expandedSections.quickLinks ? '−' : '+'}
                  </span>
                )}
              </div>
              <div className={isMobile && !expandedSections.quickLinks ? 'hidden sm:block' : ''}>
                <ul className="space-y-3">
                  {links.quickLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Apply on the go Section - Responsive */}
          <div className="w-full flex justify-center lg:justify-start lg:w-[380px] lg:-ml-[90px] lg:h-[150px]">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md w-[300px] h-[150px]">
              <h4 className="font-semibold text-gray-900 mb-1">Apply on the go</h4>
              <p className="text-sm text-gray-600 mb-4">Get real-time job updates on our App</p>
              <div className="flex justify-center gap-2">
                <a href="#" className="w-1/2 max-w-[130px]">
                  <img 
                    src="/android-app_v1.jpg" 
                    alt="Get it on Google Play" 
                    className="w-full h-auto object-contain"
                  />
                </a>
                <a href="#" className="w-1/2 max-w-[130px]">
                  <img
                    src="/ios-app_v1.jpg"
                    alt="Download on the App Store"
                    className="w-full h-auto object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 w-full">
            
            {/* Left Section: Logo + Info */}
            <div className="flex flex-col sm:flex-row sm:items-start lg:items-center gap-4 lg:gap-6 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-medium text-sm">HireNext</span>
              </div>

              {/* Text Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>All logos are trademarks of their respective owners. Used for identification purposes only.</p>
                <p>© 2025 HireNext. All rights reserved.</p>
              </div>
            </div>

            {/* Right Section: Business Logos */}
            <div className="flex-1 w-full overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                  Our businesses
                </span>

                <div className="w-full overflow-x-auto no-scrollbar">
                  <div
                    ref={logosContainerRef}
                    className="flex items-center space-x-6 min-w-max"
                  >
                    {[...businessLogos, ...businessLogos].map((logo, index) => (
                      <img
                        key={`${logo.id}-${index}`}
                        src={logo.src}
                        alt={logo.alt}
                        className="h-6 opacity-60 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info and Description - Hidden but preserved */}
      <div className="hidden">
        <p>{contactInfo.description}</p>
        <ContactItem
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_941_15626)">
                <path
                  d="M15.1875 19.4688C14.3438 19.4688 13.375 19.25 12.3125 18.8438C10.1875 18 7.84377 16.375 5.75002 14.2813C3.65627 12.1875 2.03127 9.84377 1.18752 7.68752C0.250019 5.37502 0.343769 3.46877 1.43752 2.40627C1.46877 2.37502 1.53127 2.34377 1.56252 2.31252L4.18752 0.750025C4.84377 0.375025 5.68752 0.562525 6.12502 1.18752L7.96877 3.93753C8.40627 4.59378 8.21877 5.46877 7.59377 5.90627L6.46877 6.68752C7.28127 8.00002 9.59377 11.2188 13.2813 13.5313L13.9688 12.5313C14.5 11.7813 15.3438 11.5625 16.0313 12.0313L18.7813 13.875C19.4063 14.3125 19.5938 15.1563 19.2188 15.8125L17.6563 18.4375C17.625 18.5 17.5938 18.5313 17.5625 18.5625C17 19.1563 16.1875 19.4688 15.1875 19.4688ZM2.37502 3.46878C1.78127 4.12503 1.81252 5.46877 2.50002 7.18752C3.28127 9.15627 4.78127 11.3125 6.75002 13.2813C8.68752 15.2188 10.875 16.7188 12.8125 17.5C14.5 18.1875 15.8438 18.2188 16.5313 17.625L18.0313 15.0625C18.0313 15.0313 18.0313 15.0313 18.0313 15L15.2813 13.1563C15.2813 13.1563 15.2188 13.1875 15.1563 13.2813L14.4688 14.2813C14.0313 14.9063 13.1875 15.0938 12.5625 14.6875C8.62502 12.25 6.18752 8.84377 5.31252 7.46877C4.90627 6.81252 5.06252 5.96878 5.68752 5.53128L6.81252 4.75002V4.71878L4.96877 1.96877C4.96877 1.93752 4.93752 1.93752 4.90627 1.96877L2.37502 3.46878Z"
                  fill="currentColor"
                />
                <path
                  d="M18.3125 8.90633C17.9375 8.90633 17.6563 8.62508 17.625 8.25008C17.375 5.09383 14.7813 2.56258 11.5938 2.34383C11.2188 2.31258 10.9063 2.00008 10.9375 1.59383C10.9688 1.21883 11.2813 0.906333 11.6875 0.937583C15.5625 1.18758 18.7188 4.25008 19.0313 8.12508C19.0625 8.50008 18.7813 8.84383 18.375 8.87508C18.375 8.90633 18.3438 8.90633 18.3125 8.90633Z"
                  fill="currentColor"
                />
                <path
                  d="M15.2187 9.18755C14.875 9.18755 14.5625 8.93755 14.5312 8.56255C14.3437 6.87505 13.0312 5.56255 11.3437 5.3438C10.9687 5.31255 10.6875 4.93755 10.7187 4.56255C10.75 4.18755 11.125 3.9063 11.5 3.93755C13.8437 4.2188 15.6562 6.0313 15.9375 8.37505C15.9687 8.75005 15.7187 9.0938 15.3125 9.1563C15.25 9.18755 15.2187 9.18755 15.2187 9.18755Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_941_15626">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          }
          text={contactInfo.phone}
        />
      </div>
    </footer>
  )
}

const ContactItem = ({ icon, text }) => {
  return (
    <p className="flex items-center text-sm text-gray-700">
      <span className="mr-3 text-blue-600">{icon}</span>
      <span>{text}</span>
    </p>
  )
}

ContactItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
}

const SocialLink = ({ href, name, icon }) => {
  return (
    <a
      href={href}
      aria-label={name}
      className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
    >
      {icon}
    </a>
  )
}

SocialLink.propTypes = {
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
}

export default Footer