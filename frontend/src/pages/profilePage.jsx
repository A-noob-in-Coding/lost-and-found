import React, { useState, useEffect, useRef } from "react";
import ChangePassword from "../components/changePassword";
import UserPostsGrid from "../components/userPostsGrid";
import UserCommentsGrid from "../components/userCommentsGrid";
import { useAuth } from "../context/authContext";
import { useUtil } from "../context/utilContext";
import { postService } from "../services/postService";
import { commentService } from "../services/commentService";
import Footer from "../utilities/footer";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdAddAPhoto } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { campuses } = useUtil()
  const [isloading, setisloading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'comments'
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout, updateUsername, updateProfileImage, updateCampus } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");
  const [showForgotPassword, setShowChangePassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCampus, setIsEditingCampus] = useState(false);
  const [selectedCampusId, setSelectedCampusId] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const fileInputRef = useRef(null);

  const resizeImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";  // Handle CORS issues

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = 128; // Match the container size
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(resizedDataUrl);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = imageUrl;
    });
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleNameSave = async (e) => {
    setisloading(true);
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if inside a form
      await updateUsername(username);
    }
    setisloading(false);
  };

  const handleCampusSave = async (campusId, campusName) => {
    try {
      setisloading(true);
      console.log("Updating campus to:", campusId);
      await updateCampus(campusId, campusName);
      setSelectedCampusId(campusId);
      setIsEditingCampus(false);
    } catch (error) {
      console.error("Error updating campus:", error);
    } finally {
      setisloading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePostDeleted = (deletedPostId) => {
    setUserPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setUserComments(prevComments => prevComments.filter(comment => comment.id !== deletedCommentId));
  };

  const fetchUserPosts = async () => {
    if (!user?.rollno) return;
    
    try {
      setPostsLoading(true);
      const posts = await postService.getUserPosts(user.rollno);
      setUserPosts(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to load your posts');
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchUserComments = async () => {
    if (!user?.rollno) return;
    
    try {
      setCommentsLoading(true);
      const comments = await commentService.getUserComments(user.rollno);
      setUserComments(comments);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      toast.error('Failed to load your comments');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert('Image size should be less than 3MB');
      return;
    }

    try {
      setImageLoading(true);

      // Create a temporary URL for the selected file
      const tempUrl = URL.createObjectURL(file);

      // Resize the image
      const resizedImageDataUrl = await resizeImage(tempUrl);

      // Convert the resized image data URL back to a File object
      const resizedImageFile = dataURLtoFile(resizedImageDataUrl, file.name);

      // Revoke the temporary URL to free up memory
      URL.revokeObjectURL(tempUrl);

      // Update profile with the resized image
      await updateProfileImage(resizedImageFile);
      setProfileImage(resizedImageDataUrl);

    } catch (error) {
      console.error('Failed to update profile image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    const loadAndResizeImage = async () => {
      if (user?.image_url) {
        try {
          const resizedImage = await resizeImage(user.image_url);
          setProfileImage(resizedImage);
        } catch (error) {
          console.error('Error resizing image:', error);
          setProfileImage(user.image_url); // Fallback to original image
        }
      }
      setUsername(user?.name || ""); 
      setSelectedCampusId(user?.campus_id || "");
    };

    loadAndResizeImage();
    fetchUserPosts(); // Fetch user posts when component mounts or user changes
    fetchUserComments(); // Fetch user comments when component mounts or user changes
  }, [user]); // Make sure user is included in the dependency array

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <h1 className="text-xl md:text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0 ml-auto mr-0">
            <button
              onClick={() => navigate("/feed")}
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Back to Feed
            </button>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="Log Out"
            >
              <i className="fas fa-sign-out-alt text-xl"></i>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  navigate("/feed");
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-home mr-3"></i>
                Back to Feed
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-3"></i>
                Log Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Profile Section */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* Profile Image */}
            <div className="w-[128px] h-[128px] rounded-full overflow-hidden border-4 border-gray-200 shadow-md relative group mb-6">
              {imageLoading ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <ClipLoader color="#000000" loading={true} size={40} />
                </div>
              ) : (
                <>
                  <img
                    src={profileImage || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                    onClick={handleProfileImageClick}
                  >
                    <MdAddAPhoto className="text-white text-3xl" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Profile Name */}
            <h2 className="text-2xl font-bold text-black mb-4">{username || user?.name}</h2>

            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center bg-gray-50 rounded-lg px-6 py-4 min-w-[80px]">
                <div className="text-2xl font-bold text-black">{userPosts.length}</div>
                <div className="text-sm text-gray-600">posts</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg px-6 py-4 min-w-[80px]">
                <div className="text-2xl font-bold text-black">{userComments.length}</div>
                <div className="text-sm text-gray-600">comments</div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setShowEditProfile(true)}
              className="px-8 py-2 bg-gray-100 text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Edit profile
            </button>
          </div>

          {/* Tab Toggle for Mobile */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'posts'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-th-large mr-2"></i>
                Posts
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'comments'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-comments mr-2"></i>
                Comments
              </button>
            </div>
          </div>
          
          {/* Content based on active tab */}
          {activeTab === 'posts' ? (
            postsLoading ? (
              <div className="flex justify-center items-center py-16">
                <ClipLoader color="#000000" loading={true} size={40} />
              </div>
            ) : (
              <UserPostsGrid 
                userPosts={userPosts} 
                onPostDeleted={handlePostDeleted}
              />
            )
          ) : (
            commentsLoading ? (
              <div className="flex justify-center items-center py-16">
                <ClipLoader color="#000000" loading={true} size={40} />
              </div>
            ) : (
              <UserCommentsGrid 
                userComments={userComments}
                onCommentDeleted={handleCommentDeleted}
              />
            )
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Help Others?</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Create a post to help someone find their lost item or report something you've found.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/createPost")}
              className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform"
            >
              Create Post
            </button>
            <button
              onClick={() => navigate("/feed")}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 transform"
            >
              Browse Feed
            </button>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-white bg-opacity-95">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Profile Image Section */}
              <div className="flex justify-center mb-8">
                <div className="w-[128px] h-[128px] rounded-full overflow-hidden border-4 border-gray-200 shadow-md relative group">
                  {imageLoading ? (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                      <ClipLoader color="#000000" loading={true} size={40} />
                    </div>
                  ) : (
                    <>
                      <img
                        src={profileImage || "https://via.placeholder.com/100"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                        onClick={handleProfileImageClick}
                      >
                        <MdAddAPhoto className="text-white text-3xl" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Roll Number</p>
                  <p className="text-base md:text-lg font-semibold text-black break-words">{user?.rollno}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500 font-medium">Full Name</p>
                    <button
                      onClick={() => setIsEditingName((prev) => !prev)}
                      className="text-lg md:text-xl text-black hover:text-gray-600 transition-colors p-1"
                    >
                      <MdEdit />
                    </button>
                  </div>

                  {isEditingName ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        className="text-base md:text-lg font-semibold w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition text-gray-900"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setisloading(true);
                            handleNameSave(e);
                          }
                        }}
                        autoFocus
                        placeholder="Enter your name"
                      />
                      {isloading && (
                        <ClipLoader color="#000000" loading={isloading} size={20} className="ml-2" />
                      )}
                    </div>
                  ) : (
                    <p className="text-base md:text-lg font-semibold text-black break-words">{username}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500 font-medium">Campus</p>
                    <button
                      onClick={() => setIsEditingCampus((prev) => !prev)}
                      className="text-lg md:text-xl text-black hover:text-gray-600 transition-colors p-1"
                    >
                      <MdEdit />
                    </button>
                  </div>

                  {isEditingCampus ? (
                    <div className="flex items-center">
                      <select
                        value={selectedCampusId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedName =
                            e.target.options[e.target.selectedIndex].text;
                          if (selectedId) {
                            handleCampusSave(selectedId, selectedName);
                          }
                        }} onBlur={() => setIsEditingCampus(false)}
                        className="text-base md:text-lg font-semibold w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition appearance-none text-gray-900"
                        autoFocus
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">Select Campus</option>
                        {campuses.map((campus) => (
                          <option key={campus.campusID} value={campus.campusID}>
                            {campus.campusName}
                          </option>
                        ))}
                      </select>
                      {isloading && (
                        <ClipLoader color="#000000" loading={isloading} size={20} className="ml-2" />
                      )}
                    </div>
                  ) : (
                    <p className="text-base md:text-lg font-semibold text-black break-words">
                      {user.campusName}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Email Address</p>
                  <p className="text-base md:text-lg font-semibold text-black break-all">{user?.email}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center">
                <button
                  className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform shadow-md"
                  onClick={() => {
                    localStorage.setItem('otpVerified', 'true');
                    setShowChangePassword(true);
                    setShowEditProfile(false);
                  }}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-white bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <ChangePassword setShowChangePassword={setShowChangePassword} />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
