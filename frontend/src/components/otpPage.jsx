import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function OtpPage({ setShowOtpPage,  formData }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Move to next input if current field is filled
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Navigate to previous input on backspace if current field is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.target.previousSibling;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is all numbers and proper length
    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const newOtp = [...otp];
      
      // Fill in the OTP fields
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      
      setOtp(newOtp);
      
      // Focus the field after the last filled input
      const inputs = document.querySelectorAll('input[type="text"]');
      const lastIndex = Math.min(pastedData.length, 6) - 1;
      if (lastIndex < 5 && inputs[lastIndex + 1]) {
        inputs[lastIndex + 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    // Validate that all OTP fields are filled
    if (otp.some(digit => digit === "")) {
      toast.error("Please enter the complete OTP");
      return;
    }
    
    setIsLoading(true);
    const email = localStorage.getItem('registerEmail');
    const enteredOtp = otp.join('');
    
    try {
      // First verify the OTP
      const verifyResponse = await fetch('http://localhost:5000/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: enteredOtp
        }),
      });
      
      const verifyData = await verifyResponse.json();
      
      if (verifyResponse.ok) {
        // If OTP is verified, proceed to complete the registration
        // Create a FormData object for file upload
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.fullName);
        formDataToSend.append("rollNo", formData.studentId);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("imageFile", formData.imageFile);
        
        const registerResponse = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          // Remove the Content-Type header to let the browser set it automatically with boundary info
          body: formDataToSend,
        });
        
        const registerData = await registerResponse.json();
        
        if (registerResponse.ok) {
          toast.success('Registration completed successfully');
          localStorage.removeItem('registerEmail'); // Clean up
          navigate("/login");
        } else {
          toast.error(registerData.message || 'Failed to complete registration');
        }
      } else {
        toast.error(verifyData.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Failed to verify OTP');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
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
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : null}
            className="w-10 h-12 text-center text-xl font-semibold bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          />
        ))}
      </div>
      
      <button
        className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            <span>Verifying...</span>
          </>
        ) : (
          "Submit OTP"
        )}
      </button>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-gray-500 hover:text-black transition-colors">
          Didn't receive code? Resend OTP
        </button>
      </div>
    </div>
  );
}