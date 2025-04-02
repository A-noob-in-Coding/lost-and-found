import React, { useState } from 'react';

const Feed = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState('Lost');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  // Mock data for filteredItems (you should replace this with your actual data)
  const filteredItems = [
    {
      id: 1,
      type: 'Lost',
      title: 'Lost Laptop',
      description: 'MacBook Pro 16" lost in the library',
      location: 'University Library',
      date: '2 hours ago',
      image: 'https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg',
      user: {
        name: 'John Doe',
        rollNumber: 'CS2023001',
        avatar: 'https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg'
      },
      comments: [
        {
          id: 1,
          text: 'I think I saw it near the cafeteria',
          date: '1 hour ago',
          user: {
            name: 'Jane Smith',
            avatar: 'https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg'
          }
        }
      ]
    }
  ];

  const filters = ['All', 'Lost', 'Found'];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handlePostClick = () => {
    setShowPostModal(true);
  };

  const closePostModal = () => {
    setShowPostModal(false);
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
  };

  const handleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
  };

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

  const handleAddComment = (e, itemId) => {
    e.preventDefault();
    console.log(`Adding comment to item ${itemId}: ${commentText}`);
    setCommentText('');
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    console.log('Submitting post:', postType);
    setSuccessMessage('Post created successfully!');
    setShowPostModal(false);
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background Branding */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="transform rotate-45 opacity-[0.03] text-black text-[120px] font-bold whitespace-nowrap">
          Lost & Found Lost & Found Lost & Found
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="text-xl font-bold">Lost & Found</div>
          <div className="relative flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="Search for lost or found items..."
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-black text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={handlePostClick}
              className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              <i className="fas fa-plus mr-2"></i>
              Post
            </button>
            <div className="relative">
              <i className="fas fa-bell text-xl cursor-pointer" onClick={handleNotifications}></i>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 p-4">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <div className="text-sm text-gray-600">No new notifications</div>
                </div>
              )}
            </div>
            <div className="relative">
              <i className="fas fa-envelope text-xl cursor-pointer" onClick={handleMessages}></i>
              {showMessages && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 p-4">
                  <h3 className="font-semibold mb-2">Messages</h3>
                  <div className="text-sm text-gray-600">No new messages</div>
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer overflow-hidden">
              <img
                src="https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Filter Section */}
      <div className="pt-[76px] pb-4 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex space-x-4 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
                activeFilter === filter
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="aspect-square overflow-hidden rounded-t-xl">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover object-top" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={item.user.avatar} alt={item.user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{item.user.name}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{item.user.rollNumber}</span>
                        <span className="mx-1">•</span>
                        <span>{item.date}</span>
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
                          {item.type === 'Lost' ? (
                            <li
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleAction('Found', item.type)}
                            >
                              <i className="fas fa-check mr-2"></i> Found
                            </li>
                          ) : (
                            <li
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleAction('Claim', item.type)}
                            >
                              <i className="fas fa-hand-paper mr-2"></i> Claim
                            </li>
                          )}
                          <li
                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-500"
                            onClick={() => handleAction('Report', item.type)}
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
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <button 
                  className="w-full py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors cursor-pointer whitespace-nowrap"
                  onClick={() => handleAction(item.type === 'Lost' ? 'Found' : 'Claim', item.type)}
                >
                  {item.type === 'Lost' ? 'Found This Item' : 'Claim This Item'}
                </button>
                
                {/* Comment section */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => toggleComments(item.id)} 
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <i className={`fas ${expandedComments === item.id ? 'fa-comment-slash' : 'fa-comment'} mr-2`}></i>
                    {expandedComments === item.id ? 'Hide Comments' : `Comments (${item.comments?.length || 0})`}
                  </button>
                  
                  {expandedComments === item.id && (
                    <div className="mt-3 space-y-3">
                      {/* Comments list */}
                      {item.comments && item.comments.length > 0 ? (
                        item.comments.map(comment => (
                          <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start">
                              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-medium">{comment.user.name}</div>
                                  <div className="text-xs text-gray-400">{comment.date}</div>
                                </div>
                                <div className="text-sm mt-1">{comment.text}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400 text-center py-2">No comments yet</div>
                      )}
                      
                      {/* Add comment form */}
                      <form 
                        className="flex items-center mt-3" 
                        onSubmit={(e) => handleAddComment(e, item.id)}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          <img 
                            src="https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg" 
                            alt="You" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Add a comment..." 
                          className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-black"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          required
                        />
                        <button 
                          type="submit" 
                          className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Lost & Found</h3>
              <p className="text-gray-300 text-sm">
                Helping our community reconnect with their lost belongings since 2023.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 text-xl">
                <a href="#" className="hover:text-gray-300"><i className="fab fa-facebook"></i></a>
                <a href="#" className="hover:text-gray-300"><i className="fab fa-twitter"></i></a>
                <a href="#" className="hover:text-gray-300"><i className="fab fa-instagram"></i></a>
                <a href="#" className="hover:text-gray-300"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Lost & Found. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Post</h3>
              <button onClick={closePostModal} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flex space-x-2 mb-4">
              <button 
                className={`flex-1 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${postType === 'Lost' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setPostType('Lost')}
                type="button"
              >
                <i className="fas fa-search mr-2"></i> Lost Item
              </button>
              <button 
                className={`flex-1 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${postType === 'Found' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setPostType('Found')}
                type="button"
              >
                <i className="fas fa-hand-holding mr-2"></i> Found Item
              </button>
            </div>
            
            <form onSubmit={handleSubmitPost}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  placeholder={`${postType} item title...`}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  placeholder="Where was it lost/found?"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  placeholder="Describe the item..."
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-500">Drag and drop an image or click to browse</p>
                  <input type="file" className="hidden" accept="image/*" />
                  <button type="button" className="mt-2 text-sm text-black underline">Select File</button>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={closePostModal}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors whitespace-nowrap"
                >
                  Post {postType} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;