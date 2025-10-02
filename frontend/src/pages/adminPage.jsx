import { useState, useEffect, useMemo } from 'react';
import PostVerificationContainer from '../components/postVerificationContainer.jsx';
import CommentVerificationContainer from '../components/commentVerificationContainer.jsx';
import CategoryContainer from '../components/catagorySection.jsx';
import Footer from '../utilities/footer.jsx';
import { adminService } from '../services/adminService.js';
import { utilityService } from '../services/utilService.js';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Global refresh function for all data
  const handleRefresh = async () => {
    switch (activeTab) {
      case 'posts':
        await fetchPosts();
        toast.success('Posts refreshed');
        break;
      case 'comments':
        await fetchComments();
        toast.success('Comments refreshed');
        break;
      case 'categories':
        await fetchCategories();
        toast.success('Categories refreshed');
        break;
      default:
        break;
    }
  };

  const loginAdmin = async (user, pass) => {
    try {
      setIsLoading(true);
      setLoginError("");
      await adminService.loginAdmin(user, pass);
      setAuthenticated(true);
    } catch (err) {
      console.error("Admin login error:", err);
      setLoginError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts function
  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const data = await adminService.fetchPosts();
      console.log(data)
      const withStatus = data.map((post) => ({
        ...post,
        status: "pending",
      }));
      setPosts(withStatus);
      console.log(withStatus)
    } catch (error) {
      console.error("Error fetching posts:", error.message || error);
      toast.error("Failed to fetch posts");
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch comments function
  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const data = await adminService.fetchComments();
      const withStatus = data.map((comment) => ({
        ...comment,
        status: "pending",
      }));
      setComments(withStatus);
    } catch (error) {
      console.error("Error fetching comments:", error.message || error);
      toast.error("Failed to fetch comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  // Fetch categories function
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await utilityService.fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message || error);
      toast.error("Failed to fetch categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchPosts();
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetchComments();
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetchCategories();
  }, [authenticated]);

  // Memoized pending comments
  const pendingComments = useMemo(() => {
    return comments.filter(comment => comment.status === 'pending');
  }, [comments]);

  // Memoized pending posts
  const pendingPosts = useMemo(() => {
    return posts.filter(post => post.status === 'pending');
  }, [posts]);

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
    if (loginError) {
      setLoginError('');
    }
  };

  const handlePostApprove = async (id, type) => {
    console.log(`Post approval type: ${type}, id: ${id}`);
    try {
      await adminService.approvePost(id, type);
      toast.success('Post approved successfully');
      // Re-fetch posts to get live data
      await fetchPosts();
    } catch (error) {
      console.error('Approval error:', error.message);
      toast.error(error.message || 'Approval failed');
    }
  };

  const handlePostReject = async (id, type) => {
    console.log(`Post rejection type: ${type}, id: ${id}`);
    try {
      await adminService.rejectPost(id, type);
      toast.success('Post rejected successfully');
      // Re-fetch posts to get live data
      await fetchPosts();
    } catch (error) {
      console.error('Rejection error:', error.message);
      toast.error(error.message || 'Rejection failed');
    }
  };

  const handleCommentApprove = async (commentId, commentType) => {
    try {
      await adminService.approveComment(commentId, commentType);
      toast.success('Comment approved successfully');
      // Re-fetch comments to get live data
      await fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error.message || error);
      toast.error(error.message || 'Failed to approve comment');
    }
  };

  const handleCommentReject = async (commentId, commentType) => {
    try {
      await adminService.rejectComment(commentId, commentType);
      toast.success('Comment rejected successfully');
      // Re-fetch comments to get live data
      await fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error.message || error);
      toast.error(error.message || 'Failed to reject comment');
    }
  };

  const handleAddCategory = async (categoryName) => {
    try {
      await adminService.addCategory(categoryName);
      toast.success(`Category "${categoryName}" added successfully`);
      // Re-fetch categories to get live data
      await fetchCategories();
      return { success: true, message: `Category "${categoryName}" added successfully` };
    } catch (error) {
      console.error('Error adding category:', error.message || error);
      toast.error(error.message || 'Failed to add category');
      return { success: false, message: error.message || 'Failed to add category' };
    }
  };

  const handleUpdateCategory = async (categoryId, categoryName) => {
    try {
      await adminService.updateCategory(categoryId, categoryName);
      toast.success(`Category updated to "${categoryName}"`);
      // Re-fetch categories to get live data
      await fetchCategories();
      return { success: true, message: `Category updated to "${categoryName}"` };
    } catch (error) {
      console.error('Error updating category:', error.message || error);
      toast.error(error.message || 'Failed to update category');
      return { success: false, message: error.message || 'Failed to update category' };
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const categoryToDelete = categories.find(cat => cat.category_id === categoryId);
    try {
      await adminService.deleteCategory(categoryId);
      toast.success(`Category "${categoryToDelete?.category}" deleted`);
      // Re-fetch categories to get live data
      await fetchCategories();
      return { success: true, message: `Category "${categoryToDelete?.category}" deleted` };
    } catch (error) {
      console.error('Error deleting category:', error.message || error);
      toast.error(error.message || 'Failed to delete category');
      return { success: false, message: error.message || 'Failed to delete category' };
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/lf_logo.png"
                alt="Lost & Found Logo"
                className="h-16 w-16 rounded-full shadow-lg"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-sm text-gray-600">Access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter username"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
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
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'posts'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
              >
                <i className="fas fa-clipboard-list mr-2"></i>
                Posts
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'comments'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
              >
                <i className="fas fa-comments mr-2"></i>
                Comments
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'categories'
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
                  className={`flex flex-col items-center px-3 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${activeTab === 'posts'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                    }`}
                >
                  <i className="fas fa-clipboard-list mb-1 text-sm"></i>
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex flex-col items-center px-3 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${activeTab === 'comments'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                    }`}
                >
                  <i className="fas fa-comments mb-1 text-sm"></i>
                  Comments
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex flex-col items-center px-3 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${activeTab === 'categories'
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

          {/* Refresh Button */}
          <div className="flex justify-center">
            <button
              onClick={handleRefresh}
              disabled={postsLoading || commentsLoading || categoriesLoading}
              className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className={`fas fa-sync-alt ${(postsLoading || commentsLoading || categoriesLoading) ? 'fa-spin' : ''}`}></i>
              <span className="text-sm font-medium">
                {(postsLoading || commentsLoading || categoriesLoading) ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
            {activeTab === 'posts' && (
              <PostVerificationContainer
                posts={pendingPosts}
                loading={postsLoading}
                onApprove={handlePostApprove}
                onReject={handlePostReject}
              />)}

            {activeTab === 'comments' && (
              <CommentVerificationContainer
                comments={pendingComments}
                loading={commentsLoading}
                onApprove={handleCommentApprove}
                onReject={handleCommentReject}
              />
            )}

            {activeTab === 'categories' && (
              <CategoryContainer
                categories={categories}
                loading={categoriesLoading}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
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
              <div className="text-3xl sm:text-4xl font-bold mb-2">{pendingPosts.length}</div>
              <div className="text-gray-300 text-xs sm:text-sm">Pending Posts</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">{pendingComments.length}</div>
              <div className="text-gray-300 text-xs sm:text-sm">Pending Comments</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">{categories.length}</div>
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
