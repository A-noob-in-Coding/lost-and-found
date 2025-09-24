import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostVerificationContainer from '../components/postVerificationContainer.jsx';
import CommentVerificationContainer from '../components/commentVerificationContainer.jsx';
import CategoryContainer from '../components/catagorySection.jsx';
import Footer from '../utilities/footer.jsx';

const AdminPage = () => {
  const { password } = useParams();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
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

  //ADMIN PASSWORD
  const ADMIN_PASSWORD = "admin";

  // Check if the provided password matches the admin password
  useEffect(() => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      navigate('/login');
    }
  }, [password, navigate]);

  const handlePostAction = (id, action) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, status: action } : post
    ));
  };

  // Show loading or unauthorized message while checking password
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header with Logo and Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/lf_logo.png" 
                alt="Lost & Found Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
              />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">FAST Lost & Found</h1>
            </div>
          </div>
        </header>

        {/* Access Denied Section */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <i className="fas fa-lock text-red-600 text-xl sm:text-2xl"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-3 sm:mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">Invalid admin password. Redirecting to login page...</p>
              <button 
                onClick={() => navigate('/login')}
                className="bg-black text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform"
              >
                Go to Login
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/lf_logo.png" 
              alt="Lost & Found Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4">
            Admin Dashboard
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto px-4">
            Manage posts, comments, and categories for the FAST NUCES Lost & Found platform
          </p>
        </div>
      </section>

      {/* Navigation Tabs Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6 sm:mb-8">
            {/* Desktop Tab Layout */}
            <div className="hidden sm:flex bg-gray-100 rounded-2xl p-2 space-x-2">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'posts' 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-clipboard-list mr-2"></i>
                Posts
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'comments' 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-comments mr-2"></i>
                Comments
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'categories' 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-tags mr-2"></i>
                Categories
              </button>
            </div>

            {/* Mobile Tab Layout */}
            <div className="sm:hidden w-full">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex flex-col items-center px-3 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${
                    activeTab === 'posts' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  <i className="fas fa-clipboard-list mb-1 text-sm"></i>
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex flex-col items-center px-3 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${
                    activeTab === 'comments' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  <i className="fas fa-comments mb-1 text-sm"></i>
                  Comments
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex flex-col items-center px-3 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${
                    activeTab === 'categories' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  <i className="fas fa-tags mb-1 text-sm"></i>
                  Categories
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
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
      </section>

      {/* Admin Statistics Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-black">Platform Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">0</div>
              <div className="text-gray-300 text-xs sm:text-sm">Pending Posts</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">0</div>
              <div className="text-gray-300 text-xs sm:text-sm">Pending Comments</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">5</div>
              <div className="text-gray-300 text-xs sm:text-sm">Total Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Keep the Platform Safe</h3>
          <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg px-4">
            Your moderation helps maintain a trustworthy environment for all FAST NUCES students.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button 
              onClick={() => setActiveTab('posts')}
              className="bg-white text-black px-6 sm:px-8 py-3 rounded-full text-sm sm:font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform"
            >
              Review Posts
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:font-medium hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 transform"
            >
              Review Comments
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminPage;