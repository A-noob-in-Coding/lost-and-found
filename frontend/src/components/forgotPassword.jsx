import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function ForgotPassword({
  setShowForgotPassword,
  setShowOtpPage, // Receive the function to show OTP page
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = () => {
    setIsLoading(true);
    // Simulate an API call or validation
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotPassword(false); // Hide the Forgot Password modal
      setShowOtpPage(true); // Show the OTP page
    }, 1000); // Simulate a delay
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-2xl rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-black">Reset Password</h3>
          <button
            onClick={() => setShowForgotPassword(false)}
            className="text-black-500 hover:text-black cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>
        <div className="relative mb-6">
          <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          />
        </div>
        <button
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </div>
    </div>
  );
}