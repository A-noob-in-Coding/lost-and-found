import { useState, useMemo } from "react";
import CommentForm from "./commentForm";
import { useAuth } from "../context/authContext";
import { notificationService } from "../services/notificationService.js";
import toast from 'react-hot-toast';
import { useUtil } from "../context/utilContext";
import { authService } from "../services/authService";

export default function ContentGrid({ filteredItems }) {
  const { campuses } = useUtil()
  const [expandedComments, setExpandedComments] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { user } = useAuth();

  const campusMap = useMemo(
    () => Object.fromEntries(campuses.map(c => [c.campusID, c.campusName])),
    [campuses]
  );

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
                  onClick={() => toggleComments(item.id)}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <i
                    className={`fas ${expandedComments === item.id
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
                    <CommentForm item={item} />
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
