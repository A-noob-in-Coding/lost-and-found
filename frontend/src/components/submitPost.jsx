import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { Form } from "react-router-dom";
export default function SubmitPost({ postType, setShowPostModal }) {
  const [isFormSend , setIsFormSend] = useState(false); // to check if the form is sent or not
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category_id: "",
    rollNo: "",
    description: "",
    imageFile: null,
  });
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/utility/categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    formData.rollNo = user.rollno;
  }, []);

  const handleSubmitPost = async (e) => {
    if(isFormSend) return; // Prevent multiple submissions
    e.preventDefault();
    setIsFormSend(true); // Set to true to prevent multiple submissions
    setError("");
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("imageFile", formData.imageFile);
    formDataToSend.append("category_id", formData.category_id);
    formDataToSend.append("rollno", formData.rollNo);

    let result = false;
    if (postType === "lost") {
      result = await fetch("http://localhost:5000/api/user/posts/lost", {
        method: "POST",
        // Remove the Content-Type header to let the browser set it automatically with boundary info
        body: formDataToSend,
      });
    } else {
      result = await fetch("http://localhost:5000/api/user/posts/found", {
        method: "POST",
        // Remove the Content-Type header to let the browser set it automatically with boundary info
        body: formDataToSend,
      });
    }
    if (result.ok) {
      toast.success("Item successfully posted");
    } else {
      toast.error(result.message || "Failed to post item");
    }
  };

  const fileInputRef = useRef(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
    }
  };
  return (
    <form onSubmit={handleSubmitPost}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
          placeholder={`${postType} item title...`}
          required
          onChange={handleInputChange}
          name="title"
        />
      </div>

      {/* Added Category Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm appearance-none bg-white"
          required
          onChange={handleInputChange}
          name="category_id"
          defaultValue=""
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
          placeholder="Where was it lost/found?"
          required
          onChange={handleInputChange}
          name="location"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
          placeholder="Describe the item..."
          rows={3}
          required
          name="description"
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Profile Image (JPEG, PNG, or WEBP, max 3MB)
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
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
            <div className="flex justify-center items-center w-12 h-12 border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="object-cover w-12 h-12 rounded-lg"
                style={{ width: '10vh', height: '10vh' }}
              />
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(imagePreview);
                  setImagePreview(null);
                  setFormData((prev) => ({ ...prev, imageFile: null }));
                }}
                className="absolute top-0 right-0 bg-red-500 text-red-500 text-2xl px-0 py-0 rounded-tr-lg hover:bg-red-600 transition-all"
              >
                ✖
              </button>
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
      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          onClick={() => setShowPostModal(false)}
          className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors whitespace-nowrap"
        >
          Post {postType} item
        </button>
      </div>
    </form>
  );
}
