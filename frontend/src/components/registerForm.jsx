// src/components/RegisterForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../utilities/toast.jsx";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [toastType, setToastType] = useState(""); // State for toast type ('success' or 'error')
  const [showToast, setShowToast] = useState(false); // Control toast visibility

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    setIsLoading(true); // Set loading state to true when the form is submitted

    // Simulating registration request (replace with your actual API call)
    setTimeout(() => {
      // Example of success response
      let flag = true;
      if (flag) {
        // Replace this with your actual validation logic
        setToastMessage("Registered successfully!");
        setToastType("success");
        setShowToast(true);
        setIsLoading(false); // Reset loading state after registration process completes
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        // Example of failure response
        setToastMessage("Registration failed. Please try again.");
        setToastType("error");
        setShowToast(true);
        setIsLoading(false);
      }
    }, 2000); // Simulating a 2-second delay for registration
  };

  const closeToast = () => setShowToast(false); // Close toast manually

  return (
    <div>
      <form onSubmit={handleRegister} className="space-y-6">
        {/* Register form content - unchanged */}
        <div className="relative">
          <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            required
          />
        </div>
        <div className="relative">
          <i className="fas fa-id-card absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Student ID"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            required
          />
        </div>
        <div className="relative">
          <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            required
          />
        </div>
        <div className="relative">
          <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
        >
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Register"}
        </button>
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            Already have an account? Login
          </button>
        </div>
      </form>

      {/* Toast notification for success or error */}
      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={closeToast} />
      )}
    </div>
  );
}
