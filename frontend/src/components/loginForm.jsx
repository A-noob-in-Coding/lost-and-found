import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
export default function LoginForm({ setShowForgotPassword }) {
  const navigate = useNavigate(); // Fixed typo in navigate
  const { login,user } = useAuth(); // Import login function from auth context
  const [isLoading, setIsLoading] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state

  useEffect(() => {
  }, [user]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Start loading
    console.log(rollNo+password)
    setTimeout(async () => {
      try {
        const success = await login(rollNo, password);
        if (success) {
          const from = location.state?.from?.pathname || "/feed";
          navigate(from, { replace: true });
        } else {
          setError("Invalid credentials");
        }
      } catch (error) {
        console.log(error.message)
        setError("Invalid credentials");
      } finally {
        setIsLoading(false); // Stop loading
      }
    }, 1); // Simulate 2s delay
  };
  
  const handleRollNumberChange = (e) => {
    let value = e.target.value;
    console.log(value);
    console.log(value.length);

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      if (value.length === 4) {
        value = value.slice(0, 2);
      }
    }

    if (e.nativeEvent.inputType === "insertText") {
      //checking entered is number or not
      if (isNaN(value[value.length - 1])) {
        value = value.slice(0, -1);
      }
      
      if (value.length <= 2) {
        value = value.replace(/\D/g, "");
        if (value.length === 2) {
          value = value + "L-";
        }
      }
    } else {
      const prefix = value.slice(0, 3);
      const rest = value.slice(3).replace(/[^\d-]/g, "");
      value = prefix + rest;
    }

    // Validate the format XXL-YYYY
     const rollNoRegex = /^\d{2}L-\d{4,5}$/;
    if (value.length > 8 && !rollNoRegex.test(value)) {
      setError("Roll number must be in format: XXL-YYYY (e.g., 23L-3059)");
    } else {
      setError("");
    }

    setRollNo(value);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}
      <div className="relative">
        <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Roll Number (e.g., 23L-XXXX)"
          value={rollNo}
          onChange={handleRollNumberChange}
          maxLength={8}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          required
          pattern="\d{2}L-\d{4}"
          title="Roll number format: XXL-YYYY (e.g., 23L-3059)"
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
          onClick={() => navigate("/register")}
          className="text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          Register
        </button>
      </div>
    </form>
  );
}