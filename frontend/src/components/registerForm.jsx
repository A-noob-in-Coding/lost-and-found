import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterForm({
  setShowOtpPage,
  formData,
  setFormData,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFile = (file) => {
    if (!file) return false;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WEBP image file.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 3MB");
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (validateFile(file)) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));
      setError("");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.imageFile) {
      setError("Please upload a profile image");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.fullName);
    formDataToSend.append("rollNo", formData.studentId);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("imageFile", formData.imageFile);

    try {
      // Store email in local storage for OTP verification
      localStorage.setItem("registerEmail", formData.email);

      const payload = { email: formData.email };
      console.log("Sending payload:", payload);
      console.log("Stringified payload:", JSON.stringify(payload));

      const response = await fetch("http://localhost:5000/api/otp/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email");
        setShowOtpPage(true);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Registration process failed");
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleRegister} className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="relative">
          <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            required
          />
        </div>

        <div className="relative">
          <i className="fas fa-id-card absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            name="studentId"
            placeholder="Student ID (e.g., 23L-XXXX)"
            value={formData.studentId}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            required
          />
        </div>

        <div className="relative">
          <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            required
          />
        </div>

        <div className="relative">
          <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Profile Image (JPEG, PNG, or WEBP, max 3MB)
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-500">
                  Click or drag to change image
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Drag and drop an image or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    JPEG, PNG, or WEBP (max 3MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 bg-black text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Registering...</span>
            </>
          ) : (
            <span>Register</span>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
}
