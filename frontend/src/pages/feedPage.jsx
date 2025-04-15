import React, { useState, useEffect } from "react";
import Footer from "../utilities/footer.jsx";
import Navbar from "../utilities/navbar.jsx";
import BackgroundBrand from "../utilities/backgroundBrand.jsx";
import Toast from "../utilities/toast.jsx";
import PostModal from "../components/postModal.jsx";
import ContentGrid from "../components/contentGrid.jsx";
import Filter from "../components/filter.jsx";

const Feed = () => {
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

  useEffect(() => {
    fetch("http://localhost:5000/api/user/posts/getPostData")
      .then((res) => res.json())
      .then((data) => {
        setFilteredItems(data);
      })
      .catch((err) => {
        console.error("Failed to fetch post data:", err);
      });
  }, []);

  const filters = ["All", "Lost", "Found"];

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

  const displayedItems = filteredItems.filter((item) => {
    const matchesFilter = activeFilter === "All" || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  

  return (
    <div className="min-h-screen bg-white">
      <BackgroundBrand />
      <Navbar 
  setShowPostModal={setShowPostModal} 
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
/>

      <Filter setActiveFilter={setActiveFilter} />
      <ContentGrid filteredItems={displayedItems} />
      <Footer />
      {showPostModal && <PostModal setShowPostModal={setShowPostModal} />}
      {successMessage &&
        Toast({ message: successMessage, type: "success", duration: 3000 })}
    </div>
  );
};

export default Feed;
