import { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is installed
import { useAuth } from "../context/authContext";
export default function Navbar({ setShowPostModal }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const { user } = useAuth(); // call the hook inside the component
  useEffect(() => {

    axios.get(`http://localhost:5000/api/users/image/${user.rollno}`)
      .then(res => {
        setProfileImgUrl(res.data); // Adjust if your backend sends it differently
      })
      .catch(err => {
        console.error("Failed to load profile image:", err);
      });
  }, []);

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
            onClick={() => setShowPostModal(true)}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            <i className="fas fa-plus mr-2"></i>
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
          <div className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer overflow-hidden">
            <img
              src={profileImgUrl || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
