import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setShowPostModal, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const { user, logout } = useAuth(); // call the hook inside the component

  useEffect(() => {
    // Check if user exists and has an image_url property before setting it
    if (user && user.image_url) {
      setProfileImgUrl(user.image_url);
    }
  }, [user]); // Add user as a dependency to update when user changes

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
      if (!event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleViewProfile = () => {
    navigate("/profile");
    setShowProfileDropdown(false);
  };

  const handleLogoutFromDropdown = () => {
    setShowProfileDropdown(false);
    handleLogout();
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow-sm z-50 border-b border-gray-100">
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
            <div className="relative notifications-container">
              <i
                className="fas fa-bell text-xl cursor-pointer hover:text-gray-600 transition-colors"
                onClick={handleNotifications}
              ></i>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-10">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <div className="text-sm text-gray-600">
                    No new notifications
                  </div>
                </div>
              )}
            </div>
            <div className="relative profile-dropdown-container">
              <div 
                className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-gray-300 transition-all"
                onClick={handleProfileClick}
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
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
                  <button
                    onClick={handleViewProfile}
                    className="w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-user mr-3"></i>
                    View Profile
                  </button>
                  <button
                    onClick={handleLogoutFromDropdown}
                    className="w-full flex items-center px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100">
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
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
            </div>

            {/* Mobile Menu Items */}
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  navigate("/createPost");
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-plus mr-3"></i>
                Create Post
              </button>
              <button
                onClick={() => {
                  handleNotifications();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-bell mr-3"></i>
                Notifications
              </button>
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-user mr-3"></i>
                View Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-3"></i>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}