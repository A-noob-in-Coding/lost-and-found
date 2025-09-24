import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function SubmitPost({ postType, setShowPostModal }) {
  const [isFormSend, setIsFormSend] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    campus: "",
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
        // const response = await fetch(
        //   "http://localhost:5000/utility/categories"
        // );
        // const data = await response.json();
        // setCategories(data);
        
        // Using dummy categories for testing
        const dummyCategories = [
          { category_id: 1, category: "Personal Items" },
          { category_id: 2, category: "Electronics" },
          { category_id: 3, category: "Bags & Accessories" },
          { category_id: 4, category: "Books & Stationery" },
          { category_id: 5, category: "Sports Equipment" },
          { category_id: 6, category: "Others" }
        ];
        setCategories(dummyCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    // Check if user exists before accessing rollno
    if (user && user.rollno) {
      console.log(user.rollno);
    } else {
      console.log("User not logged in or rollno not available");
    }
  }, [user]);

  const handleSubmitPost = async (e) => {
    if (isFormSend) return; // Prevent multiple submissions
    e.preventDefault();
    setIsFormSend(true); // Set to true to prevent multiple submissions
    setError("");
    
    // Check if user exists before accessing rollno
    if (!user || !user.rollno) {
      toast.error("Please log in to post an item");
      setIsFormSend(false);
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("campus", formData.campus);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image", formData.imageFile);
    formDataToSend.append("category_id", formData.category_id);
    formDataToSend.append("rollno", user.rollno);
    
    console.log("FormData entries:");
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    
    // Simulate successful post submission for testing
    try {
      // let result = false;
      // if (postType === "lost") {
      //   result = await fetch("http://localhost:5000/api/user/posts/lost", {
      //     method: "POST",
      //     body: formDataToSend,
      //   });
      // } else {
      //   result = await fetch("http://localhost:5000/api/user/posts/found", {
      //     method: "POST",
      //     body: formDataToSend,
      //   });
      // }
      
      // if (result.ok) {
        setTimeout(() => {
          toast.success(`${postType} item successfully posted (Simulated for testing)`);
          navigate("/feed");
        }, 1000);
      // } else {
      //   toast.error(result.message || "Failed to post item");
      //   setIsFormSend(false);
      // }
    } catch (error) {
      console.error("Error posting item:", error);
      toast.error("An error occurred while posting the item");
      setIsFormSend(false);
    }
  };

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
    <form onSubmit={handleSubmitPost} className="space-y-6">
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
          Campus
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm appearance-none bg-white"
          required
          onChange={handleInputChange}
          name="campus"
          defaultValue=""
        >
          <option value="" disabled>
            Select campus
          </option>
          <option value="Lahore">Lahore Campus</option>
          <option value="Karachi">Karachi Campus</option>
          <option value="Islamabad">Islamabad Campus</option>
          <option value="Peshawar">Peshawar Campus</option>
          <option value="Chiniot-Faisalabad">Chiniot-Faisalabad Campus</option>
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
          rows={4}
          required
          name="description"
          onChange={handleInputChange}
        ></textarea>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Item Image (JPEG, PNG, or WEBP, max 3MB)
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
            <div className="relative flex justify-center items-center h-auto w-40 mx-auto">
              <img
                src={imagePreview}
                alt="Preview"
                className="object-cover w-32 h-32 rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the file input
                  URL.revokeObjectURL(imagePreview);
                  setImagePreview(null);
                  setFormData((prev) => ({ ...prev, imageFile: null }));
                }}
                className="absolute top-0 right-0 transform -translate-x-2 -translate-y-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <path d="m9 15 3-3 3 3"></path>
                <path d="M12 12v9"></path>
                <path d="M16 5h6"></path>
                <path d="M19 2v6"></path>
              </svg>
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
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      
      <div className="flex space-x-4 mt-6">
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isFormSend}
          className="flex-1 py-3 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isFormSend ? "Posting..." : `Post ${postType} item`}
        </button>
      </div>
    </form>
  );
}