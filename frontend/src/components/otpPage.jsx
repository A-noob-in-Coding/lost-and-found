import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';

export default function OtpPage({ 
  setShowOtpPage, 
  setShowChangePassword,
  formData, 
  mode = "register" 
}) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Set email based on the mode we're in
    if (mode === "register") {
      setEmail(formData?.email || "");
    } else if (mode === "reset") {
      const resetEmail = localStorage.getItem('resetEmail');
      setEmail(resetEmail || "");
    }
  }, [mode, formData]);

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

  const handleResendOtp = async () => {
    console.log(email)
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    setIsResending(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('OTP resent successfully');
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Error sending OTP');
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  const handleRegisterSubmit = async (enteredOtp) => {
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
          localStorage.removeItem('resetEmail'); // Clean up
          return true;
        } else {
          toast.error(registerData.message || 'Failed to complete registration');
          return false;
        }
      } else {
        toast.error(verifyData.message || 'Invalid OTP');
        return false;
      }
    } catch (error) {
      toast.error('Failed to verify OTP');
      console.error(error);
      return false;
    }
  };

  const handleResetSubmit = async (enteredOtp) => {
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
        // If OTP is verified, allow user to reset password
        toast.success('OTP verified successfully');
        // Store verification status in localStorage to use in reset password page
        localStorage.setItem('otpVerified', 'true');
        // Show password reset form
        setShowOtpPage(false);
        setShowChangePassword(true);
        return true;
      } else {
        toast.error(verifyData.message || 'Invalid OTP');
        return false;
      }
    } catch (error) {
      toast.error('Failed to verify OTP');
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validate that all OTP fields are filled
    if (otp.some(digit => digit === "")) {
      toast.error("Please enter the complete OTP");
      return;
    }
    
    setIsLoading(true);
    const enteredOtp = otp.join('');
    
    let success = false;
    
    if (mode === "register") {
      success = await handleRegisterSubmit(enteredOtp);
    } else if (mode === "reset") {
      success = await handleResetSubmit(enteredOtp);
    }
    
    setIsLoading(false);
    return success;
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-black">
          {mode === "register" ? "Verify Registration" : "Verify Reset Password"}
        </h3>
        <button
          onClick={() => setShowOtpPage(false)}
          className="text-black hover:text-gray-800"
        >
          <FaTimes />
        </button>
      </div>
      
      <p className="text-gray-600 mb-6 text-center">
        Enter the 6-digit OTP sent to{" "}
        <span className="font-medium">{email}</span>
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
          "Verify OTP"
        )}
      </button>
      
      <div className="mt-4 text-center">
        <button 
          className="text-sm text-gray-500 hover:text-black transition-colors flex items-center justify-center mx-auto"
          onClick={handleResendOtp}
          disabled={isResending}
        >
          {isResending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Resending...</span>
            </>
          ) : (
            "Didn't receive code? Resend OTP"
          )}
        </button>
      </div>
    </div>
  );
}