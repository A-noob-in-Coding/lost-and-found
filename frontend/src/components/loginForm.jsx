// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setShowRegister, setShowForgotPassword }) {
  const navigte = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {};

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="relative">
        <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="email"
          placeholder="Email Address"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          required
        />
      </div>
      <div className="relative">
        <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
      >
        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Login"}
      </button>
      <div className="flex justify-between text-sm">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          Forgot Password?
        </button>
        <button
          type="button"
          onClick={() => navigte("/register")}
          className="text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          Register
        </button>
      </div>
    </form>
  );
}
