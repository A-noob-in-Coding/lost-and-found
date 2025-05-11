import React, { useState, useEffect } from "react";
import Footer from "../utilities/footer.jsx";
import Navbar from "../utilities/navbar.jsx";
import BackgroundBrand from "../utilities/backgroundBrand.jsx";
import Toast from "../utilities/toast.jsx";
import ContentGrid from "../components/contentGrid.jsx";
import Filter from "../components/filter.jsx";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const Feed = () => {
  const { user } = useAuth();
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
      NProgress.start();
      const response = await fetch("http://localhost:5000/api/user/posts/getPostData");
      const data = await response.json();
      setFilteredItems(data);
    } catch (err) {
      console.error("Failed to fetch post data:", err);
      toast.error("Failed to fetch posts");
    } finally {
      NProgress.done();
    }
  };
  
  const [unverifiedPosts, setUnverifiedPosts] = useState([]);
  const fetchUserPosts = async () => {
    if (user && user.rollno) {
      try {
        NProgress.start();
        const response = await fetch(`http://localhost:5000/api/user/posts/rollno/${user.rollno}`);
        const data = await response.json();
        setUserPosts(data);
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
        const response = await fetch(`http://localhost:5000/api/user/posts/unverified/rollno/${user.rollno}`);
        const data = await response.json();
        setUnverifiedPosts(data);
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
      const endpoint = `http://localhost:5000/api/user/posts/${postType.toLowerCase()}/${postId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success("Post deleted successfully!");
        // Refresh the posts after deletion
        fetchAllPosts();
        if (user && user.rollno) {
          fetchUserPosts();
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete post");
      }
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <BackgroundBrand />
      <Navbar 
        setShowPostModal={setShowPostModal} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <Filter setActiveFilter={setActiveFilter} activeFilter={activeFilter} onRefresh={onRefresh}/>
    
      <main className="flex-grow">
        <ContentGrid filteredItems={displayedItems} onDeletePost={handleDeletePost} />
      </main>
      
      <Footer />
      
      {successMessage &&
        Toast({ message: successMessage, type: "success", duration: 3000 })}
    </div>
  );
};

export default Feed;