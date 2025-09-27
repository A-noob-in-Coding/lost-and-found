import { useState, useEffect, useMemo } from 'react';
import PostVerificationContainer from '../components/postVerificationContainer.jsx';
import CommentVerificationContainer from '../components/commentVerificationContainer.jsx';
import CategoryContainer from '../components/catagorySection.jsx';
import Footer from '../utilities/footer.jsx';

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

  // Fetch posts when authenticated
  useEffect(() => {
    if (authenticated) {
      const fetchPosts = async () => {
        setPostsLoading(true);
        try {
          const response = await fetch('http://localhost:5000/api/admin/posts');
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const data = await response.json();
          // Map each post to include a pending status
          const withStatus = data.map(post => ({
            ...post,
            status: 'pending'
          }));
          setPosts(withStatus);
        } catch (error) {
          console.error('Error fetching posts:', error.message);
        } finally {
          setPostsLoading(false);
        }
      };
      fetchPosts();
    }
  }, [authenticated]);

  // Fetch comments when authenticated
  useEffect(() => {
    if (authenticated) {
      const fetchComments = async () => {
        setCommentsLoading(true);
        try {
          const response = await fetch('http://localhost:5000/comment/getcomments');
          if (!response.ok) {
            throw new Error('Failed to fetch comments');
          }
          const data = await response.json();
          // Map each comment to include a pending status
          const withStatus = data.map(comment => ({
            ...comment,
            status: 'pending'
          }));
          setComments(withStatus);
        } catch (error) {
          console.error('Error fetching comments:', error.message);
        } finally {
          setCommentsLoading(false);
        }
      };
      fetchComments();
    }
  }, [authenticated]);

  // Fetch categories when authenticated
  useEffect(() => {
    if (authenticated) {
      const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
          const response = await fetch('http://localhost:5000/api/categories');
          if (!response.ok) {
            throw new Error('Failed to fetch categories');
          }
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error('Error fetching categories:', error.message);
        } finally {
          setCategoriesLoading(false);
        }
      };
      fetchCategories();
    }
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

  const handleCommentApprove = async (commentId, commentType) => {
    try {
      let url = '';
      if (commentType === 'l') {
        url = `http://localhost:5000/comment/verifylostcomment?id=${commentId}`;
      } else if (commentType === 'f') {
        url = `http://localhost:5000/comment/verifyfoundcomment?id=${commentId}`;
      } else {
        console.error('Unknown comment type:', commentType);
        return;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to verify comment');
      }

      // Remove the verified comment from the list
      setComments(prev =>
        prev.map(comment =>
          comment.comment_id === commentId ? { ...comment, status: 'verified' } : comment
        )
      );
    } catch (error) {
      console.error('Error approving comment:', error.message);
    }
  };

  const handleCommentReject = async (commentId, commentType) => {
    try {
      const url =
        commentType === 'l'
          ? `http://localhost:5000/comment/deleteadminlostcomment?id=${commentId}`
          : `http://localhost:5000/comment/deleteadminfoundcomment?id=${commentId}`;

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Optional: Update UI by removing the comment from state
      setComments(prev =>
        prev.filter(comment => comment.comment_id !== commentId)
      );

      console.log(`Comment ${commentId} deleted successfully`);
    } catch (error) {
      console.error('Error rejecting comment:', error.message);
    }
  };

  const handleAddCategory = async (categoryName) => {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: categoryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }

      const data = await response.json();
      // Update categories state with the new category
      setCategories(prev => [...prev, data]);
      return { success: true, message: `Category "${categoryName}" added successfully` };
    } catch (error) {
      console.error('Error adding category:', error.message);
      return { success: false, message: error.message || 'Failed to add category' };
    }
  };

  const handleUpdateCategory = async (categoryId, categoryName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: categoryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }

      // Update categories state
      setCategories(prev =>
        prev.map(cat =>
          cat.category_id === categoryId
            ? { ...cat, category: categoryName }
            : cat
        )
      );
      return { success: true, message: `Category updated to "${categoryName}"` };
    } catch (error) {
      console.error('Error updating category:', error.message);
      return { success: false, message: error.message || 'Failed to update category' };
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const categoryToDelete = categories.find(cat => cat.category_id === categoryId);

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      // Update categories state
      setCategories(prev => prev.filter(cat => cat.category_id !== categoryId));
      return { success: true, message: `Category "${categoryToDelete?.category}" deleted` };
    } catch (error) {
      console.error('Error deleting category:', error.message);
      return { success: false, message: error.message || 'Failed to delete category' };
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
              <div className="text-red-600 text-sm mt-2">{loginError}</div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
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
                onApprove={(id) => handlePostAction(id, 'approve')}
                onReject={(id) => handlePostAction(id, 'reject')}
              />
            )}

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
