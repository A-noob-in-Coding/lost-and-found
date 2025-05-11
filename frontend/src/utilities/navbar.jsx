import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setShowPostModal, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
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

  const handleMessages = () => {
    setShowMessages(!showMessages);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="text-xl font-bold">Lost & Found</div>
        <div className="relative flex-1 max-w-xl mx-8">
          <input
            type="text"
            placeholder="Search for lost or found items..."
            className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-black text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate("/createPost")}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Post
          </button>
          <div className="relative">
            <i
              className="fas fa-bell text-xl cursor-pointer"
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
          <div className="relative">
            <i
              className="fas fa-envelope text-xl cursor-pointer"
              onClick={handleMessages}
            ></i>
            {showMessages && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 p-4">
                <h3 className="font-semibold mb-2">Messages</h3>
                <div className="text-sm text-gray-600">No new messages</div>
              </div>
            )}
          </div>
          <div 
            className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer overflow-hidden flex items-center justify-center"
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
      </div>
    </nav>
  );
}