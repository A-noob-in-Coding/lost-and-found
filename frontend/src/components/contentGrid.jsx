import { useState } from "react";
import CommentForm from "./commentForm";
import { useAuth } from "../context/authContext";
import toast from 'react-hot-toast';

export default function ContentGrid({filteredItems, onDeletePost}) {
  const [showDropdown, setShowDropdown] = useState(null);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const filters = ["All", "Lost", "Found" , "My Posts"];
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [items, setItems] = useState(filteredItems);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  
  const toggleDropdown = (itemId) => {
    if (showDropdown === itemId) {
      setShowDropdown(null);
    } else {
      setShowDropdown(itemId);
    }
  };  const toggleComments = (itemId) => {
    if (expandedComments === itemId) {
      setExpandedComments(null);
    } else {
      setExpandedComments(itemId);
    }
  };
  
  const handleDeletePost = async (postId, postType) => {
    // If onDeletePost prop is provided, use it; otherwise, handle locally
    if (onDeletePost) {
      onDeletePost(postId, postType);
    } else {
      try {
        const endpoint = `http://localhost:5000/api/user/posts/${postType.toLowerCase()}/${postId}`;
        const response = await fetch(endpoint, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success("Post deleted successfully!");
          // Refresh the page to update the post list
          window.location.reload();
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("An error occurred while deleting the post");
      }
    }
  };
  
  const handleAction = async (action, type, item) => {
    console.log(`${action} action for ${type} item`);
    setShowDropdown(null);
    
    try {
      // Get current user's email from auth context
      const senderEmail = user.email;
      const itemTitle = item.title;
      
      // Get receiver's email by making a request to the backend to fetch it by roll number
      const receiverRollno = item.user.rollNumber;
      
      // First, fetch the receiver's email using their roll number
      const userResponse = await fetch(`http://localhost:5000/api/users/${receiverRollno}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch receiver\'s information');
      }
      
      const userData = await userResponse.json();
      const receiverEmail = userData.email;
      
      if (action === "Found" && type === "Lost") {
        // Send found notification
        const response = await fetch('http://localhost:5000/api/notifications/found-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderEmail,
            receiverEmail,
            itemTitle
          }),
        });
        
        if (response.ok) {
          toast.success('Owner notified that you found their item!');
        } else {
          toast.error('Failed to send notification. Please try again.');
        }
      } 
      else if (action === "Claim" && type === "Found") {
        // Send claim notification
        const response = await fetch('http://localhost:5000/api/notifications/claim-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderEmail,
            receiverEmail,
            itemTitle
          }),
        });
        
        if (response.ok) {
          toast.success('Finder notified that you claimed this item!');
        } else {
          toast.error('Failed to send notification. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('An error occurred while sending the notification.');
    }
  };
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setShowFilters(false);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-black/10 relative
"
            >
              {item.isOwnPost && (
                <span className={`absolute top-2 right-2 z-10 text-xs font-semibold px-3 py-1 rounded ${item.isVerified === false ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                  {item.isVerified === false ? 'UNVERIFIED' : 'VERIFIED'}
                </span>
              )}
              <div className="aspect-square overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {item.user.name}
                      </div>                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{item.user.rollNumber}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(item.date).toLocaleString()}</span>
                        {item.isOwnPost && (
                          <>
                            <span className="mx-1">•</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.isVerified === false ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {item.isVerified === false ? 'Unverified' : 'Verified'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {showDropdown === item.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                        <ul className="py-1">                          {item.type === "Lost" ? (
                            <li
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleAction("Found", item.type, item)}
                            >
                              <i className="fas fa-check mr-2"></i> Found
                            </li>
                          ) : (
                            <li
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleAction("Claim", item.type, item)}
                            >
                              <i className="fas fa-hand-paper mr-2"></i> Claim
                            </li>
                          )}
                          {item.isOwnPost && (
                            <li
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-600"
                              onClick={() => handleDeletePost(item.id, item.post_type || item.type)}
                            >
                              <i className="fas fa-trash mr-2"></i> Delete
                            </li>
                          )}
                          <li
                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-500"
                            onClick={() => handleAction("Report", item.type)}
                          >
                            <i className="fas fa-flag mr-2"></i> Report
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {item.location}
                </div>                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>                <button
                  className={`w-full py-2 ${item.isOwnPost ? 'bg-black' : 'bg-black hover:bg-gray-900'} text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap`}
                  onClick={() =>
                    item.isOwnPost 
                    ? handleDeletePost(item.id, item.post_type || item.type)
                    : handleAction(
                        item.type === "Lost" ? "Found" : "Claim",
                        item.type,
                        item
                      )
                  }
                >
                  {item.isOwnPost 
                    ? "Delete This Item" 
                    : (item.type === "Lost" ? "Found This Item" : "Claim This Item")}
                </button>

                {/* Comment section */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleComments(item.id)}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <i
                      className={`fas ${
                        expandedComments === item.id
                          ? "fa-comment-slash"
                          : "fa-comment"
                      } mr-2`}
                    ></i>
                    {expandedComments === item.id
                      ? "Hide Comments"
                      : `Comments (${item.comments?.length || 0})`}
                  </button>

                  {expandedComments === item.id && (
                    <div className="mt-3 space-y-3">
                      {/* Comments list */}
                      {item.comments && item.comments.length > 0 ? (
                        item.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex items-start">
                              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                <img
                                  src={comment.user.avatar}
                                  alt={comment.user.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-medium">
                                    {comment.user.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                  {new Date(comment.date).toLocaleString()}
                                  </div>
                                </div>
                                <div className="text-sm mt-1">
                                  {comment.text}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400 text-center py-2">
                          No comments yet
                        </div>
                      )}
                      <CommentForm  item={item}/>
                      {/* comment form */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}