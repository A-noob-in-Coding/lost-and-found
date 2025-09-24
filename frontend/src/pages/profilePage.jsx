import React, { useState, useEffect, useRef } from "react";
import BackgroundTypography from "../components/backgroundTypography";
import ChangePassword from "../components/changePassword";
import { useAuth } from "../context/authContext";
import Footer from "../utilities/footer";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdAddAPhoto } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [isloading, setisloading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { user, logout, updateUsername, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");
  const [showForgotPassword, setShowChangePassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCampus, setIsEditingCampus] = useState(false);
  const [selectedCampusId, setSelectedCampusId] = useState("");
  const [loadingCampuses, setLoadingCampuses] = useState(false);
  const fileInputRef = useRef(null);

  // Sample campus data (not using API for now)
  const campuses = [
    { id: 1, name: "FAST NUCES Karachi", location: "Karachi" },
    { id: 2, name: "FAST NUCES Lahore", location: "Lahore" },
    { id: 3, name: "FAST NUCES Islamabad", location: "Islamabad" },
    { id: 4, name: "FAST NUCES Peshawar", location: "Peshawar" },
    { id: 5, name: "FAST NUCES Chiniot-Faisalabad", location: "Chiniot-Faisalabad" }
  ];

  const resizeImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";  // Handle CORS issues
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions while maintaining aspect ratio
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
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  const handleNameSave = async(e) => {
    setisloading(true);
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if inside a form
      await updateUsername(username);
    }
    setisloading(false);
  };

  const handleCampusSave = async (campusId) => {
    try {
      setisloading(true);
      // Add your campus update API call here
      console.log("Updating campus to:", campusId);
      // This would be the actual API call:
      // await updateUserCampus(campusId);
      
      setSelectedCampusId(campusId);
      setIsEditingCampus(false);
      toast.success("Campus updated successfully!");
    } catch (error) {
      console.error("Error updating campus:", error);
      toast.error("Failed to update campus");
    } finally {
      setisloading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
    // Fetch and resize the profile image from the backend
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
  }, [user]); // Make sure user is included in the dependency array

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
          <div className="flex-shrink-0 ml-auto mr-0">
            <button
              onClick={() => navigate("/feed")}
              className="bg-black text-white px-10 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Profile Image */}
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
            </div>

            {/* User Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-black">
                <p className="text-sm text-gray-500 mb-2 font-medium">Roll Number</p>
                <p className="text-lg font-semibold text-black">{user?.rollno}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-black">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500 font-medium">Full Name</p>
                  <button
                    onClick={() => setIsEditingName((prev) => !prev)}
                    className="text-xl text-black hover:text-gray-600 transition-colors"
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
                      className="text-lg font-semibold w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setisloading(true);
                          handleNameSave(e);
                        }
                      }}
                      autoFocus
                    />
                    {isloading && (
                      <ClipLoader color="#000000" loading={isloading} size={20} className="ml-2" />
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-black">{username}</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-black">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500 font-medium">Campus</p>
                  <button
                    onClick={() => setIsEditingCampus((prev) => !prev)}
                    className="text-xl text-black hover:text-gray-600 transition-colors"
                    disabled={loadingCampuses}
                  >
                    <MdEdit />
                  </button>
                </div>

                {isEditingCampus ? (
                  <div className="flex items-center">
                    <select
                      value={selectedCampusId}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleCampusSave(e.target.value);
                        }
                      }}
                      onBlur={() => setIsEditingCampus(false)}
                      className="text-lg font-semibold w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition appearance-none"
                      disabled={loadingCampuses}
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
                        <option key={campus.id} value={campus.id}>
                          {campus.name} {campus.location && `- ${campus.location}`}
                        </option>
                      ))}
                    </select>
                    {isloading && (
                      <ClipLoader color="#000000" loading={isloading} size={20} className="ml-2" />
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-black">
                    {selectedCampusId ? 
                      (campuses.find(c => c.id.toString() === selectedCampusId?.toString())?.name + 
                       (campuses.find(c => c.id.toString() === selectedCampusId?.toString())?.location ? 
                        ` - ${campuses.find(c => c.id.toString() === selectedCampusId?.toString())?.location}` : '')) ||
                      user?.campus_name || 
                      "Not specified" : 
                      "Not specified"}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-black">
                <p className="text-sm text-gray-500 mb-2 font-medium">Email Address</p>
                <p className="text-lg font-semibold text-black">{user?.email}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform shadow-md"
                onClick={() => {
                  localStorage.setItem('otpVerified', 'true');
                  setShowChangePassword(true);
                }}
              >
                Change Password
              </button>
              <button
                className="px-8 py-3 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-105 transform shadow-md"
                style={{ background: "#e50914" }}
                onClick={() => handleLogout()}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Account Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-black">Account Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">0</div>
              <div className="text-gray-300 text-sm">Posts Created</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">0</div>
              <div className="text-gray-300 text-sm">Items Recovered</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold mb-2">0</div>
              <div className="text-gray-300 text-sm">Total Comments</div>
            </div>
          </div>
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
         
      {/* Change Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
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