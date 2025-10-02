import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUtil } from "../context/utilContext";
import { postService } from "../services/postService";
import ConfirmationModal from "./confirmationModal";
import toast from "react-hot-toast";

export default function UserPostsGrid({ userPosts, onPostDeleted }) {
  const { campuses } = useUtil();
  const navigate = useNavigate();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [deletingPosts, setDeletingPosts] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const campusMap = useMemo(
    () => Object.fromEntries(campuses.map(c => [c.campusID, c.campusName])),
    [campuses]
  );

  const toggleDescription = (postId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleDeletePost = async (post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    setShowDeleteConfirm(false);
    setDeletingPosts(prev => ({ ...prev, [postToDelete.id]: true }));

    try {
      await postService.deletePost(postToDelete.id, postToDelete.type);
      toast.success(`${postToDelete.type} post deleted successfully`);
      if (onPostDeleted) {
        onPostDeleted(postToDelete.id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setDeletingPosts(prev => ({ ...prev, [postToDelete.id]: false }));
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  if (!userPosts || userPosts.length === 0) {
    return (
      <div className="text-center py-20">
        {/* Lost & Found Character Illustration */}
        <div className="w-32 h-32 mx-auto mb-8 relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Character SVG */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              className="text-gray-600"
              fill="currentColor"
            >
              {/* Person searching */}
              <circle cx="35" cy="30" r="8" className="fill-blue-500" />
              <rect x="30" y="38" width="10" height="20" rx="2" className="fill-blue-500" />
              <rect x="25" y="42" width="8" height="3" rx="1.5" className="fill-blue-400" />
              <rect x="37" y="42" width="8" height="3" rx="1.5" className="fill-blue-400" />
              
              {/* Magnifying glass */}
              <circle cx="65" cy="35" r="12" fill="none" stroke="#6366f1" strokeWidth="3" />
              <line x1="74" y1="44" x2="82" y2="52" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
              
              {/* Lost items scattered around */}
              <rect x="15" y="70" width="6" height="4" rx="1" className="fill-red-400" />
              <circle cx="50" cy="75" r="3" className="fill-green-400" />
              <rect x="75" y="68" width="8" height="3" rx="1.5" className="fill-yellow-400" />
              
              {/* Question marks */}
              <text x="20" y="25" className="fill-gray-400 text-xs" fontSize="8">?</text>
              <text x="80" y="30" className="fill-gray-400 text-xs" fontSize="8">?</text>
            </svg>
          </div>
          
          {/* Floating animation circles */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-purple-200 rounded-full animate-pulse delay-300"></div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3">No Posts Yet</h3>
        <p className="text-gray-600 mb-8 text-base max-w-sm mx-auto leading-relaxed">
          Help your community! Share lost items you've found or post about items you've lost.
        </p>
        
        {/* Create Post Button */}
        <button
          onClick={() => navigate("/createPost")}
          className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform inline-flex items-center shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Your First Post
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
        >
          {/* Post Image */}
          <div className="aspect-square overflow-hidden">
            <img
              src={post.image || "/no_prev_img.png"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post Content */}
          <div className="p-4">
            {/* Post Type Badge and Actions */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.type === "Lost"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  <i className={`fas ${post.type === "Lost" ? "fa-search" : "fa-hand-holding"} mr-1`}></i>
                  {post.type}
                </span>
                {post.isVerified !== undefined && (
                  <span 
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      post.isVerified === false ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {post.isVerified === false ? 'Unverified' : 'Verified'}
                  </span>
                )}
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => handleDeletePost(post)}
                disabled={deletingPosts[post.id]}
                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete post"
              >
                {deletingPosts[post.id] ? (
                  <i className="fas fa-spinner fa-spin text-sm"></i>
                ) : (
                  <i className="fas fa-trash text-sm"></i>
                )}
              </button>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>

            {/* Location and Campus */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-gray-600 text-sm">
                <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                <span className="truncate">{post.location}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <i className="fas fa-university mr-2 text-gray-400"></i>
                <span className="truncate">{campusMap[post.campusID] || campusMap[post.campusid] || 'Campus not specified'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <p className={`text-sm text-gray-600 ${!expandedDescriptions[post.id] ? "line-clamp-2" : ""}`}>
                {post.description}
              </p>
              {post.description && post.description.length > 100 && (
                <button
                  onClick={() => toggleDescription(post.id)}
                  className="text-blue-600 text-xs font-medium mt-1 hover:underline"
                >
                  {expandedDescriptions[post.id] ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            {/* Date */}
            <div className="text-xs text-gray-400">
              {post.date ? new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'No date'}
            </div>
          </div>
        </div>
      ))}
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={cancelDeletePost}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        message={postToDelete ? `Are you sure you want to delete this ${postToDelete.type} post? This action cannot be undone.` : ""}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}