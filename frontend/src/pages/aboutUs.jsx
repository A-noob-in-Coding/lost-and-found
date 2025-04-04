import React from "react";
import BackgroundTypography from "../components/backgroundTypography.jsx";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Typography */}
      <BackgroundTypography />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            The FAST NUCES Lost & Found platform was created with a simple mission: to reunite students with their lost items and provide a streamlined way for good Samaritans to return found belongings to their rightful owners.
          </p>
          
          <div className="aspect-video rounded-lg overflow-hidden mb-6">
            <img 
              src="/api/placeholder/800/450" 
              alt="FAST NUCES Campus" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            As students of FAST NUCES, we experienced firsthand the frustration of losing items on campus and the inefficient process of trying to recover them. The existing solutions were fragmented - lost items were reported on different WhatsApp groups, Facebook pages, and notice boards around campus.
          </p>
          <p className="text-gray-700 mb-6">
            In 2025, we decided to solve this problem by creating a centralized digital platform specifically designed for our campus community. Our platform makes it easy to report lost items, post found items, and connect the two parties quickly and securely.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="/api/placeholder/128/128" 
                  alt="Team Member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Abd Ur Rehman</h3>
              <p className="text-sm text-gray-500">Lead Developer</p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="/api/placeholder/128/128" 
                  alt="Team Member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Ahmed Butt</h3>
              <p className="text-sm text-gray-500">UI/UX Designer</p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="/api/placeholder/128/128" 
                  alt="Team Member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Muhammad Armaghan</h3>
              <p className="text-sm text-gray-500">To Be decided</p>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-gray-600">Items Recovered</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl font-bold mb-2">2,000+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl font-bold mb-2">85%</div>
            <div className="text-gray-600">Recovery Rate</div>
          </div>
        </div>
        
        <div className="bg-black text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="mb-6">Help us build a more connected and responsible campus community.</p>
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          onClick={() => navigate("/register")}
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}