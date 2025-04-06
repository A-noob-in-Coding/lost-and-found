import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function OtpPage({ setShowOtpPage, setShowChangePassword }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpPage(false); // Hide OTP page
      setShowChangePassword(true); // Show ChangePassword page
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-black">Enter OTP</h3>
          <button
            onClick={() => setShowOtpPage(false)}
            className="text-black hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit OTP sent to your email.
        </p>
        <div className="flex justify-center items-center gap-3 mb-6">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              className="w-10 h-12 text-center text-xl font-semibold bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
            />
          ))}
        </div>
        <button
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            "Submit OTP"
          )}
        </button>
      </div>
    </div>
  );
}