import { useState } from "react";
import CommentForm from "./commentForm";
export default function ContentGrid({filteredItems}) {
  const [showDropdown, setShowDropdown] = useState(null);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const filters = ["All", "Lost", "Found"];
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [items, setItems] = useState(filteredItems);
  const [showFilters, setShowFilters] = useState(false);
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
  const handleAction = (action, type) => {
    console.log(`${action} action for ${type} item`);
    setShowDropdown(null);
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
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-black/10
"
            >
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
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{item.user.rollNumber}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(item.date).toLocaleString()}</span>

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
                        <ul className="py-1">
                          {item.type === "Lost" ? (
                            <li
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleAction("Found", item.type)}
                            >
                              <i className="fas fa-check mr-2"></i> Found
                            </li>
                          ) : (
                            <li
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleAction("Claim", item.type)}
                            >
                              <i className="fas fa-hand-paper mr-2"></i> Claim
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
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>
                <button
                  className="w-full py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors cursor-pointer whitespace-nowrap"
                  onClick={() =>
                    handleAction(
                      item.type === "Lost" ? "Found" : "Claim",
                      item.type
                    )
                  }
                >
                  {item.type === "Lost" ? "Found This Item" : "Claim This Item"}
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