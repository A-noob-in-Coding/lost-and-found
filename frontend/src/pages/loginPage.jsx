import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import LoginForm from "../components/loginForm.jsx";
import ForgotPassword from "../components/forgotPassword.jsx";
import OtpPage from "../components/otpPage.jsx";
import ChangePassword from "../components/changePassword.jsx";

export const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <img 
                src="/lf_logo.png" 
                alt="Lost & Found Logo" 
                className="h-16 w-16 rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">
              FAST Lost & Found
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Reconnect with your belongings
            </p>
            {!showOtpPage && !showChangePassword && (
              <LoginForm setShowForgotPassword={setShowForgotPassword} />
            )}
            {showOtpPage && !showChangePassword && (
              <OtpPage
                setShowChangePassword={setShowChangePassword}
                setShowOtpPage={setShowOtpPage}
                mode="reset"
              />
            )}
            {showChangePassword && (
              <ChangePassword
                setShowChangePassword={setShowChangePassword}
              />
            )}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              © 2025 FAST NUCES Lost & Found System
            </div>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPassword
          setShowForgotPassword={setShowForgotPassword}
          setShowOtpPage={setShowOtpPage}
        />
      )}
    </div>
  );
};

export default Login;