import { useState, useMemo } from "react";
import { commentService } from "../services/commentService";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

export default function UserCommentsGrid({ userComments, onCommentDeleted }) {
  const { user } = useAuth();
  const [expandedComments, setExpandedComments] = useState({});
  const [deletingComments, setDeletingComments] = useState({});

  const toggleComment = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleDeleteComment = async (comment) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setDeletingComments(prev => ({ ...prev, [comment.id]: true }));

    try {
      // Check if user exists before proceeding
      if (!user || !user.rollno) {
        toast.error('Please log in to delete comments');
        return;
      }

      // Get the postType from comment object (handle different field names)
      const postType = comment.posttype || comment.postType;
      
      if (!postType) {
        toast.error('Cannot determine post type for comment deletion');
        return;
      }

      // Use the service instead of hardcoded API
      await commentService.deleteCommentByText(user.rollno, comment.comment, postType);

      toast.success('Comment deleted successfully');
      
      if (onCommentDeleted) {
        onCommentDeleted(comment.id);
      }
      
      // Refresh the page to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.message || 'Failed to delete comment');
    } finally {
      setDeletingComments(prev => ({ ...prev, [comment.id]: false }));
    }
  };

  // Group comments by post
  const groupedComments = useMemo(() => {
    if (!userComments || userComments.length === 0) return {};
    
    return userComments.reduce((groups, comment) => {
      const postTitle = comment.posttitle || comment.postTitle;
      const postType = comment.posttype || comment.postType;
      const isVerified = comment.isverified !== undefined ? comment.isverified : comment.isVerified;
      
      // Use post title + type as grouping key to handle edge cases
      const groupKey = `${postTitle}_${postType}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          postTitle,
          postType,
          isVerified,
          comments: []
        };
      }
      
      groups[groupKey].comments.push(comment);
      return groups;
    }, {});
  }, [userComments]);

  if (!userComments || userComments.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-comment text-gray-400 text-xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Comments Yet</h3>
        <p className="text-gray-500 text-sm">Start engaging by commenting on posts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedComments).map(([groupKey, group]) => (
        <div
          key={groupKey}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-4"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  group.postType === "Lost"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <i className={`fas ${group.postType === "Lost" ? "fa-search" : "fa-hand-holding"} mr-1`}></i>
                {group.postType} Post
              </span>
            </div>
            <div className="text-xs text-gray-400 flex items-center">
              <i className="fas fa-comment mr-1"></i>
              {group.comments.length} comment{group.comments.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Post Reference */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Comments on:</p>
            <p className="font-medium text-gray-900">{group.postTitle}</p>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {group.comments.map((comment, index) => (
              <div 
                key={comment.id} 
                className={`${index !== group.comments.length - 1 ? 'border-b border-gray-100 pb-3' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500">
                      {comment.date ? new Date(comment.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'No date'}
                    </div>
                    
                    {/* Comment Verification Status */}
                    <span 
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        (comment.isverified === false || comment.isVerified === false) 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {(comment.isverified === false || comment.isVerified === false) ? 'Unverified' : 'Verified'}
                    </span>
                  </div>
                  
                  {/* Delete Comment Button */}
                  <button
                    onClick={() => handleDeleteComment(comment)}
                    disabled={deletingComments[comment.id]}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete comment"
                  >
                    {deletingComments[comment.id] ? (
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                    ) : (
                      <i className="fas fa-trash text-xs"></i>
                    )}
                  </button>
                </div>
                <div>
                  <p className={`text-gray-700 ${!expandedComments[comment.id] ? "line-clamp-3" : ""}`}>
                    {comment.comment}
                  </p>
                  {comment.comment && comment.comment.length > 150 && (
                    <button
                      onClick={() => toggleComment(comment.id)}
                      className="text-blue-600 text-sm font-medium mt-1 hover:underline"
                    >
                      {expandedComments[comment.id] ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}