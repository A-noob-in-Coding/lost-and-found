import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";
import MobileSidebarNav from "../components/mobileSidebarNav.jsx";

export default function AboutUs() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState({});

  const toggleInfo = (memberId, infoType) => {
    const key = `${memberId}-${infoType}`;
    setShowInfo(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const teamMembers = [
    {
      name: "Abd Ur Rehman",
      rollNumber: "23L-3105",
      campus: "Lahore",
      email: "l233105@lhr.nu.edu.pk",
      role: "",
      linkedin: "https://www.linkedin.com/in/a-noob-in-coding",
      github: "https://github.com/A-noob-in-Coding",
      icon: "fa-code"
    },
    {
      name: "Muhammad Ahmad Butt",
      rollNumber: "23L-3059",
      campus: "Lahore",
      email: "l233059@lhr.nu.edu.pk",
      role: "",
      linkedin: "https://www.linkedin.com/in/muhammad-ahmad-butt-0324b036a",
      github: "https://github.com/A-git-nerd",
      icon: "fa-code"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 ml-4">
            <img 
              src="/lf_logo.png" 
              alt="Lost & Found Logo" 
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          <div className="flex-shrink-0 ml-auto mr-0">
            {/* Desktop Home Button - Hidden on mobile */}
            <button
              onClick={() => navigate("/feed")}
              className="hidden md:block bg-black text-white px-10 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Home
            </button>
            {/* Mobile Sidebar Navigation */}
            <MobileSidebarNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            About Us
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Building a connected campus community through innovative lost and found solutions
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-black">
              <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                The FAST NUCES Lost & Found platform was created with a simple mission: to reunite students with their lost items and provide a streamlined way for good Samaritans to return found belongings to their rightful owners.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border-l-4 border-black">
              <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To create a campus where no student has to worry about permanently losing their belongings, fostering a culture of trust, responsibility, and community support at FAST NUCES.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Story Behind Our Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-6 text-black">The Story Behind Our Solution</h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-4xl mx-auto">
            Our platform was born from real frustrations experienced by FAST NUCES students dealing with lost and found items.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ahmad's Perspective */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-envelope text-lg"></i>
                </div>
                <h4 className="text-xl font-bold text-black">Ahmad's Email Struggle</h4>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "I was constantly receiving unorganized emails from the university about lost and found items. The emails had no appealing UI, were scattered across multiple messages, and required a lot of time to process and understand."
              </p>
              <p className="text-gray-700 leading-relaxed">
                "The worst part? Email responses took 1-2 days, which meant by the time someone replied, items might already be gone or the situation had changed completely."
              </p>
              <div className="mt-4 text-sm text-red-700 font-medium">
                — Muhammad Ahmad Butt, Software Engineering
              </div>
            </div>

            {/* Abdur's Perspective */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mr-4">
                  <i className="fab fa-whatsapp text-lg"></i>
                </div>
                <h4 className="text-xl font-bold text-black">Abdur's WhatsApp Limitation</h4>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "I found WhatsApp groups to be better than emails for quick communication, but they still weren't the complete solution. Messages would get buried, there was no proper organization, and it was hard to track items systematically."
              </p>
              <p className="text-gray-700 leading-relaxed">
                "That's when we realized we needed a dedicated platform - something that combined the speed of WhatsApp with proper organization and tracking capabilities."
              </p>
              <div className="mt-4 text-sm text-green-700 font-medium">
                — Abd ur Rehman, Software Engineering
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="mt-12 bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 text-center">
            <h4 className="text-2xl font-bold mb-4">Our Solution</h4>
            <p className="text-gray-200 leading-relaxed max-w-4xl mx-auto">
              We combined our experiences to create a dedicated Lost & Found platform that offers instant communication, 
              organized item tracking, appealing user interface, and proper categorization - solving the problems we 
              faced with both email systems and WhatsApp groups.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Instant Communication</span>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Organized Tracking</span>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Beautiful UI</span>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Smart Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Meet Our Team</h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
              {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-8 text-center min-w-80 relative">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                    <i className={`fas ${member.icon} text-xl`}></i>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-black mb-4">{member.name}</h4>
                
                <div className="flex justify-center space-x-2">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                    title="LinkedIn"
                  >
                    <i className="fab fa-linkedin text-sm"></i>
                  </a>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                    title="GitHub"
                  >
                    <i className="fab fa-github text-sm"></i>
                  </a>
                  <a 
                    href={`mailto:${member.email}`} 
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                    title="Email"
                  >
                    <i className="fas fa-envelope text-sm"></i>
                  </a>
                  <button 
                    onClick={() => toggleInfo(index, 'roll')}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer"
                    title="Roll Number"
                  >
                    <i className="fas fa-id-badge text-sm"></i>
                  </button>
                  <button 
                    onClick={() => toggleInfo(index, 'campus')}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer"
                    title="Campus"
                  >
                    <i className="fas fa-university text-sm"></i>
                  </button>
                </div>

                {/* Popup panels */}
                {showInfo[`${index}-roll`] && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
                    <div className="text-sm">Roll Number: {member.rollNumber}</div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                  </div>
                )}
                
                {showInfo[`${index}-campus`] && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
                    <div className="text-sm">Campus: {member.campus}</div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                  </div>
                )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>      {/* Statistics Section */}
    

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Security & Trust</h4>
              <p className="text-gray-600 text-sm">We prioritize the safety and security of our users in every interaction.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart"></i>
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Community First</h4>
              <p className="text-gray-600 text-sm">Building stronger connections within the FAST NUCES community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Help us build a more connected and responsible campus community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate("/register")}
              className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform"
            >
              Register Now
            </button>
            <button 
              onClick={() => navigate("/contact")}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 transform"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
