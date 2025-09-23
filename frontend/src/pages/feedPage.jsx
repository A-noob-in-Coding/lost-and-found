import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";
import Navbar from "../utilities/navbar.jsx";
import Toast from "../utilities/toast.jsx";
import ContentGrid from "../components/contentGrid.jsx";
import Filter from "../components/filter.jsx";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy data for testing
  const dummyData = [
    {
      id: 1,
      title: "Black Leather Wallet",
      description: "Found near the main library entrance. Contains some cash and credit cards.",
      location: "Main Library",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      date: new Date().toISOString(),
      type: "Found",
      category: "Personal Items",
      user: {
        name: "Ahmad Butt",
        rollNumber: "L233059",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      },
      comments: [
        {
          id: 1,
          text: "I think this might be mine! Can you check if there's a student ID?",
          user: {
            name: "Sarah Khan",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c99e?w=40&h=40&fit=crop&crop=face"
          },
          date: new Date().toISOString()
        }
      ]
    },
    {
      id: 2,
      title: "Blue Water Bottle",
      description: "Left this in the cafeteria yesterday during lunch break. Has my name sticker on it.",
      location: "Cafeteria",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
      date: new Date(Date.now() - 86400000).toISOString(),
      type: "Lost",
      category: "Personal Items",
      user: {
        name: "Ali Hassan",
        rollNumber: "L233102",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
      },
      comments: []
    },
    {
      id: 3,
      title: "iPhone 14 Pro",
      description: "Lost my phone near the parking area. It has a clear case with a blue pop socket.",
      location: "Parking Area",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop",
      date: new Date(Date.now() - 172800000).toISOString(),
      type: "Lost",
      category: "Electronics",
      user: {
        name: "Fatima Ahmed",
        rollNumber: "L233078",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
      },
      comments: [
        {
          id: 2,
          text: "I saw someone hand in a phone to the security office yesterday.",
          user: {
            name: "Hassan Ali",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
          },
          date: new Date().toISOString()
        },
        {
          id: 3,
          text: "Thanks for the info! I'll check there.",
          user: {
            name: "Fatima Ahmed",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
          },
          date: new Date().toISOString()
        }
      ]
    },
    {
      id: 4,
      title: "Red Backpack",
      description: "Found this backpack in the computer lab. Contains some notebooks and a calculator.",
      location: "Computer Lab 2",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      date: new Date(Date.now() - 259200000).toISOString(),
      type: "Found",
      category: "Bags",
      user: {
        name: "Muhammad Usman",
        rollNumber: "L233091",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      },
      comments: []
    },
    {
      id: 5,
      title: "Keys with FAST Keychain",
      description: "Set of keys with a FAST NUCES keychain. Found near the main entrance.",
      location: "Main Entrance",
      image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300&h=300&fit=crop",
      date: new Date(Date.now() - 345600000).toISOString(),
      type: "Found",
      category: "Personal Items",
      user: {
        name: "Ayesha Malik",
        rollNumber: "L233067",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c99e?w=40&h=40&fit=crop&crop=face"
      },
      comments: [
        {
          id: 4,
          text: "These look like my keys! Can I meet you to confirm?",
          user: {
            name: "Ahmed Khan",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          },
          date: new Date().toISOString()
        }
      ]
    },
    {
      id: 6,
      title: "Scientific Calculator",
      description: "Lost my Casio calculator in the engineering building. It has my roll number written on the back.",
      location: "Engineering Building",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=300&fit=crop",
      date: new Date(Date.now() - 432000000).toISOString(),
      type: "Lost",
      category: "Electronics",
      user: {
        name: "Zain Abbas",
        rollNumber: "L233045",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
      },
      comments: []
    }
  ];

    const onRefresh = async () => {
    setFilteredItems([]); // Clear posts while refreshing
    await fetchAllPosts();
    if (user && user.rollno) {
      await fetchUserPosts();
      await fetchUnverifiedPosts();
    }
  }
  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      NProgress.start();
      // const response = await fetch("http://localhost:5000/api/user/posts/getPostData");
      // const data = await response.json();
      // setFilteredItems(data);
      
      // Using dummy data for testing
      setTimeout(() => {
        setFilteredItems(dummyData);
        setIsLoading(false);
        toast.success("Posts loaded successfully! (Using dummy data for testing)");
      }, 1000);
    } catch (err) {
      console.error("Failed to fetch post data:", err);
      toast.error("Failed to fetch posts");
      setIsLoading(false);
    } finally {
      NProgress.done();
    }
  };
  
  const [unverifiedPosts, setUnverifiedPosts] = useState([]);
  const fetchUserPosts = async () => {
    if (user && user.rollno) {
      try {
        NProgress.start();
        // const response = await fetch(`http://localhost:5000/api/user/posts/rollno/${user.rollno}`);
        // const data = await response.json();
        // setUserPosts(data);
        
        // Using empty array for testing
        setUserPosts([]);
        toast.success("User posts loaded! (Using dummy data for testing)");
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
        toast.error("Failed to fetch your posts");
      } finally {
        NProgress.done();
      }
    }
  };
    const fetchUnverifiedPosts = async () => {
    if (user && user.rollno) {
      try {
        NProgress.start();
        // const response = await fetch(`http://localhost:5000/api/user/posts/unverified/rollno/${user.rollno}`);
        // const data = await response.json();
        // setUnverifiedPosts(data);
        
        // Using empty array for testing
        setUnverifiedPosts([]);
      } catch (err) {
        console.error("Failed to fetch unverified posts:", err);
        toast.error("Failed to fetch unverified posts");
      } finally {
        NProgress.done();
      }
    }
  };
  
  useEffect(() => {
    fetchAllPosts();
    if (user && user.rollno) {
      fetchUserPosts();
      fetchUnverifiedPosts();
    }
  }, [user]);
  
  useEffect(() => {
    if (activeFilter === "My Posts" && user && user.rollno) {
      fetchUserPosts();
    }
  }, [activeFilter]);
  
  const filters = ["All", "Lost", "Found", "My Posts"];
  const toggleDropdown = (itemId) => {
    setShowDropdown(showDropdown === itemId ? null : itemId);
  };

  const toggleComments = (itemId) => {
    setExpandedComments(expandedComments === itemId ? null : itemId);
  };

  const handleAction = (action, type) => {
    console.log(`${action} action for ${type} item`);
    setShowDropdown(null);
  };

  const handleAddComment = (e, itemId) => {
    e.preventDefault();
    console.log(`Adding comment to item ${itemId}: ${commentText}`);
    setCommentText("");
  };
  
  const handleDeletePost = async (postId, postType) => {
    NProgress.start();
    try {
      // const endpoint = `http://localhost:5000/api/user/posts/${postType.toLowerCase()}/${postId}`;
      // const response = await fetch(endpoint, {
      //   method: 'DELETE'
      // });
      
      // if (response.ok) {
        toast.success("Post deleted successfully! (Simulated for testing)");
        // Refresh the posts after deletion
        fetchAllPosts();
        if (user && user.rollno) {
          fetchUserPosts();
        }
      // } else {
      //   const errorData = await response.json();
      //   toast.error(errorData.message || "Failed to delete post");
      // }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post");
    } finally {
      NProgress.done();
    }
  };
  
  const displayedItems = activeFilter === "My Posts" 
    ? [
        // Add verified posts
        ...userPosts.map(userPost => {
          // Find the full post data from filteredItems using post_id
          const fullPostData = filteredItems.find(item => item.id === userPost.post_id);
          if (fullPostData) {
            // Add flags to indicate this is user's own post and it's verified
            return { ...fullPostData, isOwnPost: true, post_type: userPost.post_type, isVerified: true };
          }
          return null;
        }).filter(Boolean),
        // Add unverified posts
        ...unverifiedPosts.map(unverifiedPost => {
          // For unverified posts, use the data directly from the API
          // Create an object that follows the same structure as verified posts
          return {
            id: unverifiedPost.post_id,
            title: unverifiedPost.title,
            description: unverifiedPost.description,
            location: unverifiedPost.location,
            image: unverifiedPost.image_url || 'https://via.placeholder.com/300?text=No+Image',
            date: unverifiedPost.created_at,
            type: unverifiedPost.post_type,
            category: unverifiedPost.category,
            isOwnPost: true,
            post_type: unverifiedPost.post_type,
            isVerified: false,
            user: {
              name: user?.name || 'User',
              rollNumber: user?.rollno || '',
              avatar: user?.image || 'https://via.placeholder.com/40'
            }
          };
        })
      ]
    : filteredItems.filter((item) => {
        const matchesFilter = activeFilter === "All" || item.type === activeFilter;
        const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      });

  // Handle "My Posts" filter when user is not logged in - just show empty instead of redirecting
  const effectiveFilter = activeFilter;
  const effectiveItems = activeFilter === "My Posts" && !user ? [] : displayedItems;

  const EmptyState = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-search text-gray-400 text-2xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Posts Found</h3>
        {activeFilter === "My Posts" && !user ? (
          <div>
            <p className="text-gray-300 mb-4">Please log in to view your posts.</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Log In
            </button>
          </div>
        ) : searchQuery ? (
          <div>
            <p className="text-gray-300 mb-4">
              No posts match your search for "{searchQuery}". Try different keywords or check your spelling.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Clear Search
            </button>
          </div>
        ) : activeFilter !== "All" ? (
          <div>
            <p className="text-gray-300 mb-4">
              No {activeFilter.toLowerCase()} items found. Be the first to post one!
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              View All Posts
            </button>
          </div>
        ) : !isLoading && (
          <div className="space-x-4">
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Show All Posts
            </button>
            <button
              onClick={() => navigate("/createPost")}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Create Post
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar 
        setShowPostModal={setShowPostModal} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* Filter component with proper spacing */}
      <div className="pt-16">
        <Filter setActiveFilter={setActiveFilter} activeFilter={effectiveFilter} onRefresh={onRefresh}/>
      </div>
    
      <main className="flex-grow">
        <ContentGrid filteredItems={displayedItems} onDeletePost={handleDeletePost} />
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
      
      {successMessage &&
        Toast({ message: successMessage, type: "success", duration: 3000 })}
    </div>
  );
};

export default Feed;