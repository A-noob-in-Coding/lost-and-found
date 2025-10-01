import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";
import Navbar from "../utilities/navbar.jsx";
import Toast from "../utilities/toast.jsx";
import ContentGrid from "../components/contentGrid.jsx";
import Filter from "../components/filter.jsx";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { postService } from "../services/postService.js";
import toast from "react-hot-toast";

const Feed = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [campusFilter, setCampusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [expandedComments, setExpandedComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = async () => {
    setFilteredItems([]); // Clear posts while refreshing
    await fetchAllPosts();
  };

  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      NProgress.start();
      const data = await postService.getAllPosts();
      setFilteredItems(data);
    } catch (err) {
      console.error("Failed to fetch post data:", err);
      toast.error("Failed to fetch posts");
      setIsLoading(false);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Filter items based on active filters and search query
  const displayedItems = filteredItems.filter((item) => {
    const matchesFilter = activeFilter === "All" || item.type === activeFilter;

    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCampus = !campusFilter || item.campusID?.toString() === campusFilter.toString();

    const matchesCategory = !categoryFilter || item.category_id?.toString() === categoryFilter.toString();

    return matchesFilter && matchesSearch && matchesCampus && matchesCategory;
  }); const EmptyState = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-search text-gray-400 text-2xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Posts Found</h3>
        {searchQuery ? (
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
        <Filter
          setActiveFilter={setActiveFilter}
          activeFilter={activeFilter}
          onRefresh={onRefresh}
          campusFilter={campusFilter}
          setCampusFilter={setCampusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      </div>

      <main className="flex-grow">
        <ContentGrid filteredItems={displayedItems} />
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
