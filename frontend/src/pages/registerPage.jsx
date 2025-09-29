import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/registerForm.jsx";
import OtpPage from "../components/otpPage.jsx";
import { useAuth } from "../context/authContext";
export const Register = () => {
  const navigate = useNavigate();
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    campusId: "",
    password: "",
    imageFile: null
  });


  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-full w-full bg-white shadow-lg  overflow-hidden border border-gray-200">
        <div className="p-6">
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-black transition-colors duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span className="text-sm">Back to Preview</span>
            </button>
          </div>

          {!showOtpPage ? (
            <RegisterForm
              setShowOtpPage={setShowOtpPage}
              formData={formData}
              setFormData={setFormData}
            />
          ) : (
            <OtpPage
              setShowOtpPage={setShowOtpPage}
              formData={formData}
            />
          )}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            © 2025 FAST NUCES Lost & Found System
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
