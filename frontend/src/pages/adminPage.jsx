import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostVerificationContainer from '../components/postVerificationContainer.jsx';
import CommentVerificationContainer from '../components/commentVerificationContainer.jsx';
import CategoryContainer from '../components/catagorySection.jsx';

const AdminPage = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_PASSWORD = "admin";

  const loginAdmin = async (user, pass) => {
    try {
      setIsLoading(true);
      setLoginError('');
      
      const response = await fetch("http://localhost:5000/api/users/loginAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user, password: pass }), 
      });
  
      const data = await response.json();
      if (response.ok) {
        setAuthenticated(true);
        setShowLoginForm(false);
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error("Network or fetch error:", err);
      setLoginError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Always show login form when component mounts
  useEffect(() => {
    setShowLoginForm(true);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      setLoginError('Please enter both username and password');
      return;
    }
    await loginAdmin(loginData.username, loginData.password);
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const handlePostAction = (id, action) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, status: action } : post
    ));
  };

  // Show login form if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter username"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>
            
            {loginError && (
              <div className="text-red-600 text-sm mt-2">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Back to Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main admin dashboard (only shown when authenticated)
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard - Lost and Found</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('posts')}
              className={`!rounded-button whitespace-nowrap px-4 py-2 text-sm font-medium ${activeTab === 'posts' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <i className="fas fa-clipboard-list mr-2"></i>
              Posts
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`!rounded-button whitespace-nowrap px-4 py-2 text-sm font-medium ${activeTab === 'comments' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <i className="fas fa-comments mr-2"></i>
              Comments
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`!rounded-button whitespace-nowrap px-4 py-2 text-sm font-medium ${activeTab === 'categories' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <i className="fas fa-tags mr-2"></i>
              Categories
            </button>
            <button
              onClick={() => {
                setAuthenticated(false);
                setShowLoginForm(true);
                navigate('/login');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Logout
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
          <CommentVerificationContainer />
        )}
        
        {activeTab === 'categories' && (
          <CategoryContainer />
        )}
      </div>
    </div>
  );
};

export default AdminPage;