import React, { useState, useEffect } from "react";
import BackgroundTypography from "../components/backgroundTypography";
import ChangePassword from "../components/changePassword";
import { useAuth } from "../context/authContext";
import axios from "axios";
import Footer from "../utilities/footer";
const ProfilePage = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const [showForgotPassword,setShowChangePassword] = useState(false);
  useEffect(() => {
    // Fetch the profile image from the backend
    axios
      .get(`http://localhost:5000/api/users/image/${user.rollno}`)
      .then((res) => {
        setProfileImage(res.data || "https://via.placeholder.com/128"); // Fallback image if data is empty
      })
      .catch((err) => {
        console.error("Failed to load profile image:", err);
        setProfileImage("https://via.placeholder.com/128"); // Fallback image in case of error
      });
  }, [user.rollno]);

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        {/* Background with large text */}
        <BackgroundTypography />

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg w-[600px] p-8 z-10 relative">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
  <div className="w-[128px] h-[128px] rounded-full overflow-hidden border-4 border-white shadow-md">
    <img
      src={profileImage}
      alt="Profile"
      className="max-w-[100px] h-full object-cover"
      style={{maxWidth: "100px"}} // Added inline styles for max width and height
    />
  </div>
</div>
          <h1 className="text-2xl font-bold text-center mb-2">User Profile</h1>
          <p className="text-gray-500 text-center mb-8">
            Manage your personal information
          </p>

          {/* User Information */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-md p-4">
              <p className="text-sm text-gray-500 mb-1">Roll Number</p>
              <p className="font-medium">{user.rollno}</p>
            </div>

            <div className="bg-gray-100 rounded-md p-4">
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div className="bg-gray-100 rounded-md p-4">
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-6 ">
            {/* <button className="text-sm w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-white-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg">
              Edit Profile
            </button> */}
            <button className="text-sm w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
            onClick={() => setShowChangePassword(true)
          }
            >
              
              Change Password
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            © 2025 FAST NUCES Lost & Found System
          </div>
        </div>
        {showForgotPassword && (
  <div className="mt-6">
    <ChangePassword setShowChangePassword={setShowChangePassword} />
  </div>
)}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
