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
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 ml-4">
              <img 
                src="/lf_logo.png" 
                alt="Lost & Found Logo" 
                className="h-10 w-10 rounded-full"
              />
              <h1 className="text-2xl font-bold text-black">FAST Lost & Found</h1>
            </div>
          </div>
        </header>

        {/* Access Denied Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-lock text-red-600 text-2xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-8 text-lg">Invalid admin password. Redirecting to login page...</p>
              <button 
                onClick={() => navigate('/login')}
                className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform"
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3 ml-4">
            <img 
              src="/lf_logo.png" 
              alt="Lost & Found Logo" 
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Admin Dashboard
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage posts, comments, and categories for the FAST NUCES Lost & Found platform
          </p>
        </div>
      </section>

      {/* Navigation Tabs Section */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-2xl p-2 space-x-2">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
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
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
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
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'categories' 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
              >
                <i className="fas fa-tags mr-2"></i>
                Categories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Platform Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">0</div>
              <div className="text-gray-300 text-sm">Pending Posts</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">0</div>
              <div className="text-gray-300 text-sm">Pending Comments</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-gray-300 text-sm">Total Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Keep the Platform Safe</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Your moderation helps maintain a trustworthy environment for all FAST NUCES students.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setActiveTab('posts')}
              className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform"
            >
              Review Posts
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 transform"
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