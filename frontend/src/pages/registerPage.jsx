import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/registerForm.jsx";
import OtpPage from "../components/otpPage.jsx";

export const Register = () => {
  const navigate = useNavigate();
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    imageFile: null
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
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
            
            <div className="flex justify-center mb-6">
              <img 
                src="/lf_logo.png" 
                alt="Lost & Found Logo" 
                className="h-16 w-16 rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-center tracking-tight">
              FAST Lost & Found
            </h1>
            <p className="text-gray-500 text-center mt-2 mb-6">
              Reconnect with your belongings
            </p>
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
    </div>
  );
};

export default Register;
