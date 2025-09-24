import { useState } from "react";
import CommentForm from "./commentForm";
import { useAuth } from "../context/authContext";
import toast from 'react-hot-toast';
import { FaCheck, FaEllipsisV, FaTrash } from "react-icons/fa";

export default function ContentGrid({filteredItems, onDeletePost}) {
  const [showDropdown, setShowDropdown] = useState(null);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loadingStates, setLoadingStates] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const filters = ["All", "Lost", "Found" , "My Posts"];
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [items, setItems] = useState(filteredItems);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { user } = useAuth();
  
  const toggleDropdown = (itemId) => {
    if (showDropdown === itemId) {
      setShowDropdown(null);
    } else {
      setShowDropdown(itemId);
    }
  };
  
  const toggleComments = (itemId) => {
    if (expandedComments === itemId) {
      setExpandedComments(null);
    } else {
      setExpandedComments(itemId);
    }
  };

  const toggleDescription = (itemId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  const setItemLoading = (itemId, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [itemId]: isLoading
    }));
  };

  const handleDeletePost = async (postId, postType) => {
    setItemLoading(postId, true);
    try {
      // If onDeletePost prop is provided, use it; otherwise, handle locally
      if (onDeletePost) {
        await onDeletePost(postId, postType);
      } else {
        // const endpoint = `http://localhost:5000/api/user/posts/${postType.toLowerCase()}/${postId}`;
        // const response = await fetch(endpoint, {
        //   method: 'DELETE'
        // });
        
        // if (response.ok) {
          toast.success("Post deleted successfully! (Simulated for testing)");
          // Refresh the page to update the post list
          // window.location.reload();
        // } else {
        //   const errorData = await response.json();
        //   toast.error(errorData.message || "Failed to delete post");
        // }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post");
    } finally {
      setItemLoading(postId, false);
    }
  };
  
  const handleAction = async (action, type, item) => {
    setItemLoading(item.id, true);
    try {
      // Check if user exists before proceeding
      if (!user || !user.email) {
        toast.error('Please log in to perform this action');
        setItemLoading(item.id, false);
        return;
      }

      // Get current user's email from auth context
      const senderEmail = user.email;
      const itemTitle = item.title;
      
      // Get receiver's email by making a request to the backend to fetch it by roll number
      const receiverRollno = item.user.rollNumber;
      
      // Simulating notification sending for testing
      // const userResponse = await fetch(`http://localhost:5000/api/users/${receiverRollno}`);
      // if (!userResponse.ok) {
      //   throw new Error('Failed to fetch receiver\'s information');
      // }
      
      // const userData = await userResponse.json();
      // const receiverEmail = userData.email;
      
      if (action === "Found" && type === "Lost") {
        // Send found notification
        // const response = await fetch('http://localhost:5000/api/notifications/found-item', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     senderEmail,
        //     receiverEmail,
        //     itemTitle
        //   }),
        // });
        
        // if (response.ok) {
          toast.success('Owner notified that you found their item! (Simulated for testing)');
        // } 
        // else if(response.status === 400) {
        //   const errorData = await response.json();
        //   toast.error(errorData.message || 'Sender and receiver cannot be same.');
        // }
        // else {
        //   toast.error('Failed to send notification. Please try again.');
        // }
      } 
      else if (action === "Claim" && type === "Found") {
        // Send claim notification
        // const response = await fetch('http://localhost:5000/api/notifications/claim-item', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     senderEmail,
        //     receiverEmail,
        //     itemTitle
        //   }),
        // });
        
        // if (response.ok) {
          toast.success('Finder notified that you claimed this item! (Simulated for testing)');
        // } 
        //  else if(response.status === 400) {
        //   const errorData = await response.json();
        //   toast.error(errorData.message || 'Sender and receiver cannot be same.');
        // } else {
        //   toast.error('Failed to send notification. Please try again.');
        // }
      }
      setShowDropdown(null);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('An error occurred while sending the notification.');
    } finally {
      setItemLoading(item.id, false);
    }
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setShowFilters(false);
  };

  const handleDeleteComment = async (comment, type) => {
    try {
      // Check if user exists before proceeding
      if (!user || !user.rollno) {
        toast.error('Please log in to delete comments');
        return;
      }

      // const response = await fetch('http://localhost:5000/comment/user/deletebytext', {
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     rollNo: user.rollno,
      //     comment: comment.text,
      //     type: type.toLowerCase()
      //   }),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   toast.error(errorData.message || 'Failed to delete comment');
      //   return;
      // }

      toast.success('Comment deleted successfully (Simulated for testing)');

      // Refresh the comments by refreshing the page
      // window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('An error occurred while deleting the comment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-black/10 relative flex flex-col h-full"
          >
              {item.isOwnPost && (
                <span
                  className="absolute top-2 right-2 z-10 text-xs font-semibold px-3 py-1 rounded text-white"
                  style={{ backgroundColor: item.isVerified === false ? '#ef4444' : '#10b981' }}
                >
                  {item.isVerified ? 'Verified' : 'Unverified'}
                </span>
              )}
              <div className="aspect-square overflow-hidden rounded-t-xl">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      {item.user?.avatar ? (
                        <img
                          src={item.user.avatar}
                          alt={item.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <i className="fas fa-user text-gray-400"></i>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {item.user.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center flex-wrap">
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
                </div>
                
                {/* Content section */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <i className="fas fa-university mr-2"></i>
                    {item.campus || 'Campus not specified'}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {item.location}
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-sm text-gray-600 ${!expandedDescriptions[item.id] ? "line-clamp-2" : ""}`}>
                      {item.description}
                    </p>
                    {item.description && item.description.length > 120 && (
                      <button 
                        onClick={() => toggleDescription(item.id)} 
                        className="text-blue-600 text-xs font-medium mt-1 hover:underline"
                      >
                        {expandedDescriptions[item.id] ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  
                </div>
                {/* Button section - now consistently at the bottom */}                <div className="mt-auto">
                  <button
                    disabled={loadingStates[item.id]}
                    className={`w-full py-2 ${item.isOwnPost ? 'bg-black' : 'bg-black hover:bg-gray-900'} text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center`}
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
                    {loadingStates[item.id] ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {item.isOwnPost ? "Deleting..." : (item.type === "Lost" ? "Processing..." : "Processing...")}
                      </>
                    ) : (
                      item.isOwnPost 
                      ? "Delete This Item" 
                      : (item.type === "Lost" ? "Found This Item" : "Claim This Item")
                    )}
                  </button>
                </div>

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
                                {comment.user?.avatar ? (
                                  <img
                                    src={comment.user.avatar}
                                    alt={comment.user.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <i className="fas fa-user text-gray-400 text-xs"></i>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-medium">
                                    {comment.user.name}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs text-gray-400">
                                      {new Date(comment.date).toLocaleString()}
                                    </div>
                                    {user && user.rollno && comment.user.name === user.name && (
                                      <button style={{ marginLeft: "10px" }}
                                        onClick={() => handleDeleteComment(comment, item.type)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Delete comment"
                                      >
                                        <FaTrash size={12} />
                                      </button>
                                    )}
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
                      <CommentForm item={item}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}