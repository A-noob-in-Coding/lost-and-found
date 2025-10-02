import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useUtil } from "../context/utilContext.jsx";
export default function RegisterForm({ setShowOtpPage,
  formData,
  setFormData, }
) {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { campuses } = useUtil()
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordRegex.test(value)) {
        setError(
          "Password must be at least 8 characters long, include 1 capital letter and 1 special character"
        );
      } else {
        setError("");
      }
    }
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

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    try {
      setShowOtpPage(true)

    } catch (error) {
      toast.error("Error while registering user")
    }
    setIsLoading(false)
  };

  const handleRollNumberChange = (e) => {
    let value = e.target.value;

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      if (value.length === 4) {
        value = value.slice(0, 2);
      }
    }

    if (e.nativeEvent.inputType === "insertText") {
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

    const rollNoRegex = /^\d{2}L-\d{4,5}$/;
    if (value.length > 8 && !rollNoRegex.test(value)) {
      setError("Roll number must be in format: XXL-YYYY (e.g., 23L-3059)");
    } else {
      setError("");
    }

    setFormData((prev) => ({
      ...prev,
      studentId: value,
    }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Section - Form Fields */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleRollNumberChange}
                maxLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="e.g., 23L-XXXX"
                required
                pattern="\d{2}L-\d{4,5}"
                title="Roll number format: XXL-YYYY (e.g., 23L-3059)"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Campus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campus <span className="text-red-500">*</span>
              </label>
              <select
                name="campusId"
                value={formData.campusId || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="" disabled>Select your campus</option>
                {campuses.map((campus) => (
                  <option key={campus.campusID} value={campus.campusID}>
                    {campus.campusName}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setShowPasswordRequirements(false)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                  required
                  pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$"
                  title="Password must be at least 8 characters long, include 1 capital letter, 1 special character, and 1 digit"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600`}></i>
                </button>
              </div>
              {showPasswordRequirements && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-2">Password requirements:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Must contain 1 capital letter</li>
                    <li>• Must contain 1 special character (!@#$%^&*)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value !== formData.password) {
                      setError("Passwords do not match");
                    } else {
                      setError("");
                    }
                  }}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600`}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Image Upload */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Image</h2>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload a clear profile picture (JPEG, PNG, or WEBP, max 3MB)
              </p>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging
                  ? "border-black bg-gray-50 scale-105"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
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
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="mx-auto h-40 w-40 object-cover rounded-full border-4 border-white shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <i className="fas fa-camera text-white text-2xl"></i>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Looking good!</p>
                      <p className="text-xs text-gray-500">
                        Click to change your profile image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                    </div>
                    <div className="space-y-2">
                      <p className="text-base font-medium text-gray-700">
                        Drop your image here
                      </p>
                      <p className="text-sm text-gray-500">
                        or <span className="text-black font-medium">browse</span> to upload
                      </p>
                      <p className="text-xs text-gray-400">
                        JPEG, PNG, or WEBP (max 3MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <i className="fas fa-info-circle text-yellow-400 mt-0.5 mr-2"></i>
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Profile Image Tips</p>
                    <p className="text-yellow-700 mt-1">
                      Use a clear, well-lit photo of yourself. This helps others identify you when returning lost items.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-black text-white font-medium rounded-lg transition-all duration-300 ${isLoading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-gray-800"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="text-black font-medium hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
