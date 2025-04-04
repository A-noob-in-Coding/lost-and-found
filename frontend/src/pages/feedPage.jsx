import React, { useState } from "react";
import Footer from "../utilities/footer.jsx";
import Navbar from "../utilities/navbar.jsx";
import BackgroundBrand from "../utilities/backgroundBrand.jsx";
import Toast from "../utilities/toast.jsx";
import PostModal from "../components/postModal.jsx";
import ContentGrid from "../components/contentGrid.jsx";
import Filter from "../components/filter.jsx";
const Feed = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState("Lost");
  const [successMessage, setSuccessMessage] = useState("");
  // const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentText, setCommentText] = useState("");

  const filteredItems = [
    {
      id: 1,
      type: "Lost",
      title: "Lost Laptop",
      description: 'MacBook Pro 16" lost in the library',
      location: "University Library",
      date: "2 hours ago",
      image:
        "https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg",
      user: {
        name: "John Doe",
        rollNumber: "CS2023001",
        avatar:
          "https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg",
      },
      comments: [
        {
          id: 1,
          text: "I think I saw it near the cafeteria",
          date: "1 hour ago",
          user: {
            name: "Jane Smith",
            avatar:
              "https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg",
          },
        },
      ],
    },
  ];

  const filters = ["All", "Lost", "Found"];

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
    setCommentText("");
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    console.log("Submitting post:", postType);
    setSuccessMessage("Post created successfully!");
    setShowPostModal(false);

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background Branding */}

      <BackgroundBrand />
      {/* ye nav bar hi shera */}
      <Navbar setShowPostModal={setShowPostModal}/>

      {/* Filter Section */}
      <Filter setActiveFilter={setActiveFilter} />

      {/* Content Grid */}
      <ContentGrid filteredItems={filteredItems} />

      <Footer />
      {/* Post Modal */}
      {showPostModal && (
        // post Modal idher ana
        <PostModal setPostType={setPostType} postType={postType} setShowPostModal={setShowPostModal} />
      )}

      {/* Success Message Toast */}
      {successMessage &&
        Toast({ message: successMessage, type: "success", duration: 3000 })}
    </div>
  );
};

export default Feed;
