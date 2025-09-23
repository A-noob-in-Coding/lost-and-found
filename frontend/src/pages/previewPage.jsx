import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";

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
          <div className="flex items-center space-x-3 ml-4">
            <img 
              src="/lf_logo.png" 
              alt="Lost & Found Logo" 
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          <div className="flex-shrink-0 ml-auto mr-0">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-10 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-12">
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
      <section className="py-12 bg-white">
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
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden hover:scale-105 transform cursor-pointer"
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
              className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
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
      <Footer />

      {/* Fixed/Sticky Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-50 border-t border-gray-800">
        <div className="px-6 py-3 flex justify-between items-center w-full">
          <div className="text-sm text-gray-400">
            Preview of Lost & Found
          </div>
          <div className="flex items-center space-x-3 mr-8">
            <span className="text-sm text-gray-300">Sign up to join our community</span>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-black px-10 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white border-2 border-white transition-all duration-300 hover:scale-110 transform"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;