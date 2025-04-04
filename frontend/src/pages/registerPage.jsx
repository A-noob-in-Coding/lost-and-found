import React, { useState } from "react";

// import LoginForm from "../components/loginForm.jsx"
import BackgroundTypography from "../components/backgroundTypography.jsx";
// import ForgotPassword from '../components/forgotPassword.jsx';
import RegisterForm from "../components/registerForm.jsx";
export const Register = () => {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Instead of showing stats, navigate to the feed page
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Typography */}
        <BackgroundTypography />
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden z-10 transition-all duration-300 hover:shadow-3xl">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center shadow-lg">
                <i className="fas fa-search text-white text-2xl"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">
              FAST Lost & Found
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Reconnect with your belongings
            </p>
            <RegisterForm setShowForgotPassword={setShowForgotPassword} />
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              © 2025 FAST NUCES Lost & Found System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
