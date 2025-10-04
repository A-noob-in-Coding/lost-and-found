import { useState, useMemo, useEffect } from "react";
import CommentForm from "./commentForm";
import { useAuth } from "../context/authContext";
import { notificationService } from "../services/notificationService.js";
import toast from 'react-hot-toast';
import { useUtil } from "../context/utilContext";
import { authService } from "../services/authService";

export default function ContentGrid({ filteredItems }) {
  const { campuses } = useUtil()
  const [selectedItemForComments, setSelectedItemForComments] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { user } = useAuth();

  const campusMap = useMemo(
    () => Object.fromEntries(campuses.map(c => [c.campusID, c.campusName])),
    [campuses]
  );

  const toggleComments = (item) => {
    setSelectedItemForComments(item);
  };

  const closeCommentsPanel = () => {
    setSelectedItemForComments(null);
  };

  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedItemForComments) {
        closeCommentsPanel();
      }
    };

    if (selectedItemForComments) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedItemForComments]);

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
  // this is claim/found action

  const handleAction = async (action, type, item) => {
    setItemLoading(item.id, true);
    try {
      if (!user || !user.email) {
        toast.error("Please log in to perform this action");
        setItemLoading(item.id, false);
        return;
      }

      const senderEmail = user.email;
      const itemTitle = item.title;
      const receiverRollno = item.user.rollNumber;

      const { email: receiverEmail } =
        await authService.getUserByRollNumber(receiverRollno)

      if (action === "Found" && type === "Lost") {
        // Send found notification using service
        try {
          await notificationService.sendFoundItemNotification(senderEmail, receiverEmail, itemTitle);
          toast.success('Owner notified that you found their item!');
        } catch (error) {
          if (error.response?.status === 400) {
            toast.error(error.response.data.message || 'Sender and receiver cannot be same.');
          } else {
            toast.error('Failed to send notification. Please try again.');
          }
        }
      }
      else if (action === "Claim" && type === "Found") {
        // Send claim notification using service
        try {
          await notificationService.sendClaimItemNotification(senderEmail, receiverEmail, itemTitle);
          toast.success('Finder notified that you claimed this item!');
        } catch (error) {
          if (error.response?.status === 400) {
            toast.error(error.response.data.message || 'Sender and receiver cannot be same.');
          } else {
            toast.error('Failed to send notification. Please try again.');
          }
        }
      }
      setShowDropdown(null);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("An error occurred while sending the notification.");
    } finally {
      setItemLoading(item.id, false);
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
            <div className="aspect-square overflow-hidden rounded-t-xl">
              <img
                src={item.image || "/no_prev_img.png"}
                alt={item.title}
                className="w-full h-full object-cover object-top"
              />
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Content section */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <i className="fas fa-university mr-2"></i>
                  {campusMap[item.campusID] || 'Campus not specified'}
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

              {/* Button section - consistently at the bottom */}
              <div className="mt-auto">
                <button
                  disabled={loadingStates[item.id]}
                  className="w-full py-2 bg-black hover:bg-gray-900 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
                  onClick={() => handleAction(
                    item.type === "Lost" ? "Found" : "Claim",
                    item.type,
                    item
                  )}
                >
                  {loadingStates[item.id] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    item.type === "Lost" ? "Found This Item" : "Claim This Item"
                  )}
                </button>
              </div>

              {/* Comment section */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleComments(item)}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-comment mr-2"></i>
                  Comments ({item.comments?.length || 0})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Instagram-style Comments Panel */}
      {selectedItemForComments && (
        <div 
          className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-2 md:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeCommentsPanel();
            }
          }}
        >
          <div className="bg-white rounded-2xl w-[90vw] h-[90vh] max-w-7xl flex flex-col md:flex-row overflow-hidden shadow-2xl">
            {/* Left side - Post (Top on mobile, Left on desktop) */}
            <div className="w-full md:w-1/2 h-64 md:h-full bg-[#E5E7EB] relative overflow-hidden">
              <img
                src={selectedItemForComments.image || "/no_prev_img.png"}
                alt={selectedItemForComments.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            {/* Right side - Comments (Bottom on mobile, Right on desktop) */}
            <div className="w-full md:w-1/2 flex flex-col flex-1">
              {/* Header */}
              <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                    {selectedItemForComments.user?.avatar ? (
                      <img
                        src={selectedItemForComments.user.avatar}
                        alt={selectedItemForComments.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <i className="fas fa-user text-gray-400 text-xs md:text-sm"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base">{selectedItemForComments.user.name}</div>
                    <div className="text-xs md:text-sm text-gray-500">{selectedItemForComments.user.rollNumber}</div>
                  </div>
                </div>
                <button
                  onClick={closeCommentsPanel}
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <i className="fas fa-times text-gray-500 text-sm md:text-base"></i>
                </button>
              </div>
              
              {/* Post Details */}
              <div className="p-3 md:p-4 border-b border-gray-200">
                <h3 className="font-semibold text-base md:text-lg mb-2">{selectedItemForComments.title}</h3>
                <div className="flex items-center text-gray-600 text-xs md:text-sm mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-3 ${
                    selectedItemForComments.type === "Lost"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    <i className={`fas ${selectedItemForComments.type === "Lost" ? "fa-search" : "fa-hand-holding"} mr-1`}></i>
                    {selectedItemForComments.type}
                  </span>
                  <i className="fas fa-university mr-1"></i>
                  <span className="truncate">{campusMap[selectedItemForComments.campusID] || 'Campus not specified'}</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs md:text-sm mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span className="truncate">{selectedItemForComments.location}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-700 mb-3 line-clamp-2 md:line-clamp-none">{selectedItemForComments.description}</p>
                <div className="text-xs text-gray-500">
                  {new Date(selectedItemForComments.date).toLocaleString()}
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 min-h-0">
                <div className="space-y-3 md:space-y-4">
                  {selectedItemForComments.comments && selectedItemForComments.comments.length > 0 ? (
                    selectedItemForComments.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-2 md:space-x-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-xs md:text-sm truncate">{comment.user.name}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {new Date(comment.date).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-700 break-words">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 md:py-8">
                      <i className="fas fa-comments text-gray-300 text-2xl md:text-3xl mb-3"></i>
                      <p className="text-gray-500 text-sm md:text-base">No comments yet</p>
                      <p className="text-gray-400 text-xs md:text-sm">Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Comment Form */}
              <div className="p-3 md:p-4 border-t border-gray-200">
                <CommentForm item={selectedItemForComments} />
              </div>
              
              {/* Action Button */}
              <div className="p-3 md:p-4 border-t border-gray-200">
                <button
                  disabled={loadingStates[selectedItemForComments.id]}
                  className="w-full py-2.5 md:py-3 bg-black hover:bg-gray-900 text-white rounded-lg font-medium text-sm md:text-base transition-colors flex items-center justify-center"
                  onClick={() => handleAction(
                    selectedItemForComments.type === "Lost" ? "Found" : "Claim",
                    selectedItemForComments.type,
                    selectedItemForComments
                  )}
                >
                  {loadingStates[selectedItemForComments.id] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    selectedItemForComments.type === "Lost" ? "Found This Item" : "Claim This Item"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
