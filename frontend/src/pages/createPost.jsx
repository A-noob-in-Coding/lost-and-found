import SubmitPost from "../components/submitPost.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [postType, setPostType] = useState("lost");
  const navigate = useNavigate();
  
  // Modified to work as a page - navigates back instead of closing modal
  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Create New Post</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
              postType === "lost"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setPostType("lost")}
            type="button"
          >
            <i className="fas fa-search mr-2"></i> Lost Item
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
              postType === "found"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setPostType("found")}
            type="button"
          >
            <i className="fas fa-hand-holding mr-2"></i> Found Item
          </button>
        </div>
        
        {/* Modified to use handleClose instead of setShowPostModal */}
        <div className="overflow-y-auto">
          <SubmitPost
            postType={postType} 
            setShowPostModal={handleClose} 
          />
        </div>
      </div>
    </div>
  );
}