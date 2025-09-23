import React from "react";
import { useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const navigate = useNavigate();

  // Sample items data matching the screenshots
  const sampleItems = [
    {
      id: 1,
      title: "Black Leather Wallet",
      description: "Found near the main library entrance",
      location: "Main Library",
      time: "2 hours ago",
      type: "Found",
      image: "/fast_nuces.png",
      badge: "Found"
    },
    {
      id: 2,
      title: "Keys with University Keychain",
      description: "Lost somewhere in the cafeteria area",
      location: "Cafeteria",
      time: "4 hours ago",
      type: "Lost",
      image: "/icon.jpg",
      badge: "Lost"
    },
    {
      id: 3,
      title: "Blue Notebook",
      description: "Found in Computer Science Department",
      location: "CS Department",
      time: "6 hours ago",
      type: "Found",
      image: "/fast_nuces.png",
      badge: "Found"
    },
    {
      id: 4,
      title: "Black Backpack",
      description: "Lost near the parking area",
      location: "Parking Area",
      time: "8 hours ago",
      type: "Lost",
      image: "/icon.jpg",
      badge: "Lost"
    },
    {
      id: 5,
      title: "White Earphones",
      description: "Found in the gymnasium locker room",
      location: "Gymnasium",
      time: "12 hours ago",
      type: "Found",
      image: "/fast_nuces.png",
      badge: "Found"
    },
    {
      id: 6,
      title: "Red Water Bottle",
      description: "Lost during the morning lecture",
      location: "Lecture Hall 1",
      time: "1 day ago",
      type: "Lost",
      image: "/icon.jpg",
      badge: "Lost"
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <img 
              src="/lf_logo.png" 
              alt="Lost & Found Logo" 
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          <div className="flex-shrink-0 ml-auto">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Reconnect with Your Belongings
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Browse lost items, report missing belongings, and help others at FAST 
            NUCES. Join our community-driven platform to reunite students with their 
            lost possessions.
          </p>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-2 text-black">Recent Activity</h3>
          <p className="text-gray-600 text-center mb-8">
            Latest lost and found items from the FAST NUCES community
          </p>
          
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Item Badge */}
                <div className="relative">
                  <div className="h-40 overflow-hidden rounded-t-2xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${
                      item.type === "Found" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Item Content */}
                <div className="p-4">
                  <h4 className="text-base font-semibold text-black mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  
                  <div className="flex items-center text-gray-500 text-xs mb-1">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    <span>{item.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-xs">
                    <i className="fas fa-clock mr-1"></i>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Items Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-900 transition-colors"
            >
              View All Items
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-black mb-2">247</div>
              <div className="text-gray-600">Items Reunited</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">1,543</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lf_logo.png" 
                  alt="Lost & Found Logo" 
                  className="h-8 w-8 rounded-full"
                />
                <h3 className="text-xl font-bold">FAST Lost & Found</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Reconnecting students with their belongings at FAST NUCES.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <button 
                    onClick={() => navigate("/login")}
                    className="hover:text-white transition-colors"
                  >
                    Browse Items
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/login")}
                    className="hover:text-white transition-colors"
                  >
                    Report Lost
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/login")}
                    className="hover:text-white transition-colors"
                  >
                    Report Found
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/contact")}
                    className="hover:text-white transition-colors"
                  >
                    Guidelines
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <button 
                    onClick={() => navigate("/contact")}
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/contact")}
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/contact")}
                    className="hover:text-white transition-colors"
                  >
                    Guidelines
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div className="md:col-span-3 mt-8 pt-8 border-t border-gray-800">
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex flex-col space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <i className="fab fa-facebook text-blue-500"></i>
                  <span>Facebook</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fab fa-twitter text-blue-400"></i>
                  <span>Twitter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fab fa-instagram text-pink-500"></i>
                  <span>Instagram</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 FAST NUCES Lost & Found System. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Fixed/Sticky Bottom Navbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center w-full">
            <div className="text-sm text-gray-400">
              Preview of Lost & Found
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
              <span className="text-sm text-gray-300">Sign up to join our community</span>
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PreviewPage;