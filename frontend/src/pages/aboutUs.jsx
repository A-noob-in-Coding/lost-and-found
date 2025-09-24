import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";
import MobileSidebarNav from "../components/mobileSidebarNav.jsx";

export default function AboutUs() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Abd Ur Rehman",
      rollNumber: "23L-3105",
      campus: "Lahore Campus",
      role: "",
      linkedin: "https://www.linkedin.com/in/a-noob-in-coding",
      github: "https://github.com/A-noob-in-Coding",
      icon: "fa-code"
    },
    {
      name: "Muhammad Ahmad Butt",
      rollNumber: "23L-3059",
      campus: "Lahore Campus",
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
            <h1 className="text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          <div className="flex-shrink-0 ml-auto mr-0">
            {/* Desktop Home Button - Hidden on mobile */}
            <button
              onClick={() => navigate("/")}
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

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-black mb-8">Our Story</h3>
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <p className="text-gray-600 leading-relaxed mb-6">
              As students of FAST NUCES, we experienced firsthand the frustration of losing items on campus and the inefficient process of trying to recover them. The existing solutions were fragmented - lost items were reported on different WhatsApp groups, Facebook pages, and notice boards around campus.
            </p>
            <p className="text-gray-600 leading-relaxed">
              In 2025, we decided to solve this problem by creating a centralized digital platform specifically designed for our campus community. Our platform makes it easy to report lost items, post found items, and connect the two parties quickly and securely.
            </p>
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
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-8 text-center min-w-80">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                    <i className={`fas ${member.icon} text-xl`}></i>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">{member.name}</h4>
                <p className="text-gray-600 text-sm mb-1">{member.rollNumber}</p>
                <p className="text-gray-500 text-xs mb-4">{member.campus}</p>
                <div className="flex justify-center space-x-3">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fab fa-linkedin text-sm"></i>
                  </a>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fab fa-github text-sm"></i>
                  </a>
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Our Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-300 text-sm">Items Recovered</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">2,000+</div>
              <div className="text-gray-300 text-sm">Active Users</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-gray-300 text-sm">Recovery Rate</div>
            </div>
          </div>
        </div>
      </section>

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
