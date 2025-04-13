import React, { useState } from 'react';
import PostVerificationContainer from '../components/postVerificationContainer.jsx';
import CommentVerificationContainer from '../components/commentVerificationContainer.jsx';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Lost Gold Watch",
      location: "Central Park, New York",
      description: "Vintage gold watch with leather strap. Has an engraving on the back saying 'To John, With Love'.",
      image: "https://readdy.ai/api/search-image?query=A%20high-quality%20professional%20photograph%20of%20a%20vintage%20gold%20watch%20with%20brown%20leather%20strap%20on%20a%20clean%20white%20background%2C%20soft%20shadows%2C%20detailed%20texture%20of%20the%20leather%20and%20gold%20metal%2C%20studio%20lighting%2C%20product%20photography%20style%2C%20minimalist&width=400&height=300&seq=1&orientation=landscape",
      status: "pending"
    }
  ]);


  const handlePostAction = (id, action) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: action } : post
    ));
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard - Lost and Found</h1>
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('posts')}
              className="!rounded-button whitespace-nowrap px-4 py-2 text-sm font-medium bg-black text-white"
            >
              <i className="fas fa-clipboard-list mr-2"></i>
              Posts
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className="!rounded-button whitespace-nowrap px-4 py-2 text-sm font-medium bg-black text-white"
            >
              <i className="fas fa-comments mr-2"></i>
              Comments
            </button>
          </div>
        </div>
        {activeTab === 'posts' && (
          <PostVerificationContainer 
            posts={posts} 
            onApprove={(id) => handlePostAction(id, 'approve')} 
            onReject={(id) => handlePostAction(id, 'reject')} 
          />
        )}
        {activeTab === 'comments' && (
          <CommentVerificationContainer 
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
