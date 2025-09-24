import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setShowPostModal, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const { user } = useAuth(); // call the hook inside the component

  useEffect(() => {
    // Check if user exists and has an image_url property before setting it
    if (user && user.image_url) {
      setProfileImgUrl(user.image_url);
    }
  }, [user]); // Add user as a dependency to update when user changes

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo - Always visible */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lf_logo.png" 
              alt="Lost & Found Logo" 
              className="h-8 w-8 rounded-full"
            />
            <div className="text-lg sm:text-xl font-bold">Lost & Found</div>
          </div>

          {/* Search Bar - Hidden on mobile, visible on tablets and up */}
          <div className="hidden md:block relative flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="Search for lost or found items..."
              className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-full focus:outline-none focus:border-black text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <i className="fas fa-search text-white text-sm"></i>
            </div>
          </div>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={() => navigate("/createPost")}
              className="bg-black text-white px-6 lg:px-8 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              Post
            </button>
            <div className="relative">
              <i
                className="fas fa-bell text-xl cursor-pointer hover:text-gray-600 transition-colors"
                onClick={handleNotifications}
              ></i>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 p-4">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <div className="text-sm text-gray-600">
                    No new notifications
                  </div>
                </div>
              )}
            </div>
            <div 
              className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-gray-300 transition-all"
              onClick={() => navigate("/profile")}
            >
              {profileImgUrl ? (
                <div className="w-full h-full relative">
                  <img
                    src={profileImgUrl || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
            >
              <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu}>
          <div className="fixed top-[60px] right-0 w-80 bg-white h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for lost or found items..."
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <i className="fas fa-search text-white text-sm"></i>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    navigate("/createPost");
                    setShowMobileMenu(false);
                  }}
                  className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-plus"></i>
                  <span>Create Post</span>
                </button>

                <button
                  onClick={() => {
                    handleNotifications();
                  }}
                  className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-bell"></i>
                  <span>Notifications</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowMobileMenu(false);
                  }}
                  className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}