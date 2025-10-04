import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../utilities/footer.jsx";
import { postService } from "../services/postService.js";
import { dummyPosts, transformApiDataToPreviewFormat } from "../data/dummyData.js";
import toast from 'react-hot-toast';

const PreviewPage = () => {
  const navigate = useNavigate();

  // Animation states for counters
  const [itemsCount, setItemsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch statistics from API
  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const stats = await postService.getStatistics();
      
      // Animate counters with real data
      const timer1 = animateCounter(0, stats.totalPosts, 2000, setItemsCount);
      const timer2 = animateCounter(0, stats.totalUsers, 2500, setUsersCount);
      const timer3 = animateCounter(0, stats.totalComments, 2200, setCommentsCount);
      
      // Store timers for cleanup
      return [timer1, timer2, timer3];
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Failed to load statistics');
      // Fallback to default animation values
      const timer1 = animateCounter(0, 500, 2000, setItemsCount);
      const timer2 = animateCounter(0, 2000, 2500, setUsersCount);
      const timer3 = animateCounter(0, 150, 2200, setCommentsCount);
      return [timer1, timer2, timer3];
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch recent posts from API
  const fetchRecentPosts = async () => {
    try {
      setIsLoading(true);
      const apiPosts = await postService.getRecent6Posts();
      
      // Transform API data to match preview format
      const transformedPosts = apiPosts.map(transformApiDataToPreviewFormat);
      
      // If we have less than 6 posts, fill with dummy data
      if (transformedPosts.length < 6) {
        const neededDummyCount = 6 - transformedPosts.length;
        const dummyDataToAdd = dummyPosts.slice(0, neededDummyCount);
        setRecentItems([...transformedPosts, ...dummyDataToAdd]);
      } else {
        setRecentItems(transformedPosts);
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      toast.error('Failed to load recent posts');
      // Fallback to dummy data if API fails
      setRecentItems(dummyPosts);
    } finally {
      setIsLoading(false);
    }
  };

  // Animated counter function
  const animateCounter = (start, end, duration, setter) => {
    const range = end - start;
    const increment = range / (duration / 16); // 16ms per frame (60fps)
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setter(Math.floor(current));
    }, 16);
    
    return timer;
  };

  // Start animations and fetch data when component mounts
  useEffect(() => {
    let timers = [];
    
    const loadData = async () => {
      // Fetch statistics and start animations
      const statTimers = await fetchStatistics();
      timers = statTimers;
      
      // Fetch recent posts
      await fetchRecentPosts();
    };
    
    loadData();

    // Cleanup timers on unmount
    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, []);

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
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-4 sm:px-6 md:px-10 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mt-4 sm:mt-6 md:mt-10 mb-6 sm:mb-8 md:mb-10 px-4">
            Reconnect with Your Belongings
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-4 leading-relaxed">
            Browse lost items, report missing belongings, and help others at FAST 
            NUCES. Join our community-driven platform to reunite students with their 
            lost possessions.
          </p>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-black">Recent Activity</h3>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-12 px-4">
            Latest lost and found items from the FAST NUCES community
          </p>
          
          {/* Items Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">Loading recent items...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate("/login")}
                  className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden hover:scale-105 transform cursor-pointer w-[77%] sm:w-[49.5%] lg:w-[30%] max-w-xs sm:max-w-sm"
                >
                {/* Item Badge */}
                <div className="relative">
                  <div className="h-34 sm:h-26 lg:h-35 xl:h-44 overflow-hidden rounded-t-lg sm:rounded-t-xl lg:rounded-t-2xl">
                    <img
                      src={item.image || "/no_prev_img.png"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`absolute top-0.5 right-0.5 sm:top-1 sm:right-1 lg:top-2 lg:right-2 px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2 lg:py-1 rounded-full text-xs font-semibold text-white ${
                      item.type === "Found" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Item Content */}
                <div className="p-2 sm:p-3 lg:p-4">
                  <h4 className="text-sm sm:text-sm lg:text-base font-semibold text-black mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1 line-clamp-1 sm:line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                    <div className="flex items-center flex-1 min-w-0">
                      <i className="fas fa-map-marker-alt mr-1 flex-shrink-0"></i>
                      <span className="truncate text-xs">{item.location}</span>
                    </div>
                    <div className="flex items-center ml-1 flex-shrink-0">
                      <i className="fas fa-university mr-1"></i>
                      <span className="text-xs truncate max-w-20 sm:max-w-24 lg:max-w-none">{item.campus}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-xs">
                    <i className="fas fa-clock mr-1"></i>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {/* View All Items Button */}
          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white mt-4 px-6 sm:px-8 py-3 rounded-full text-sm sm:font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              View All Items
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-black text-white rounded-2xl p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                {statsLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  itemsCount
                )}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">Total Posts</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                {statsLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  usersCount.toLocaleString()
                )}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">Active Users</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                {statsLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  commentsCount
                )}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">Comments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="pb-0">
        <Footer />
      </div>

      {/* Fixed/Sticky Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white z-50 border-t border-gray-800">
        <div className="px-3 sm:px-6 py-3 flex justify-between items-center w-full">
          <div className="text-xs sm:text-sm text-gray-400">
            Preview of Lost & Found
          </div>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-xs sm:text-sm text-gray-300">Sign up to join our community</span>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-black px-4 sm:px-10 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-black hover:text-white border-2 border-white transition-all duration-300 hover:scale-110 transform"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;