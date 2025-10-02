import { useState, useMemo } from "react";
import { useUtil } from "../context/utilContext";
import { postService } from "../services/postService";
import toast from "react-hot-toast";

export default function UserPostsGrid({ userPosts, onPostDeleted }) {
  const { campuses } = useUtil();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [deletingPosts, setDeletingPosts] = useState({});

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
    if (!window.confirm(`Are you sure you want to delete this ${post.type} post?`)) {
      return;
    }

    setDeletingPosts(prev => ({ ...prev, [post.id]: true }));

    try {
      await postService.deletePost(post.id, post.type);
      toast.success(`${post.type} post deleted successfully`);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setDeletingPosts(prev => ({ ...prev, [post.id]: false }));
    }
  };

  if (!userPosts || userPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-camera text-gray-400 text-xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Posts Yet</h3>
        <p className="text-gray-500 text-sm">Start sharing by creating your first post!</p>
      </div>
    );
  }

  return (
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
  );
}