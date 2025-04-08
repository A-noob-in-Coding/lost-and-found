import { useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword({ setShowChangePassword }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);
    const email = localStorage.getItem('resetEmail');

    try {
      const response = await fetch('http://localhost:5000/api/users/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully');
        localStorage.removeItem('resetEmail'); // Clean up
        setShowChangePassword(false);
        navigate('/login');
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.log('Error:', error);
      setError('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white shadow-2xl rounded-xl p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-black">Change Password</h3>
        <button
          onClick={() => setShowChangePassword(false)}
          className="text-black-500 hover:text-black cursor-pointer"
        >
          <FaTimes />
        </button>
      </div>
      <div className="relative mb-8">
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      <div className="relative mb-4">
        <input
          type={isConfirmPasswordVisible ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
           onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  </div>
  );
}