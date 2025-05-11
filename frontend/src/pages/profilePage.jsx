import React, { useState, useEffect, useRef } from "react";
import BackgroundTypography from "../components/backgroundTypography";
import ChangePassword from "../components/changePassword";
import { useAuth } from "../context/authContext";
import Footer from "../utilities/footer";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdAddAPhoto } from "react-icons/md";
import { ClipLoader } from "react-spinners";

const ProfilePage = () => {
  const [isloading, setisloading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { user, logout, updateUsername, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");
  const [showForgotPassword, setShowChangePassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const fileInputRef = useRef(null);

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
    };

    loadAndResizeImage();
  }, [user]); // Make sure user is included in the dependency array

  return (
     <>
       <div className=" min-h-screen bg-white flex items-center justify-center font-sans">
         {/* Background with large text */}
         <BackgroundTypography />
 
         {/* Profile Card */}
         <div className="bg-white rounded-xl shadow-lg w-[600px] p-8 z-5 relative">
           {/* Profile Image */}
               <div className="flex justify-center mb-6">
                       <div className="w-[128px] h-[128px] rounded-full overflow-hidden border-4 border-white shadow-md relative group">
                         {imageLoading ? (
                           <div className="flex items-center justify-center w-full h-full bg-gray-200">
                             <ClipLoader color="#e50914" loading={true} size={40} />
                           </div>
                         ) : (
                           <>
                             <img
                               src={profileImage || "https://via.placeholder.com/100"}
                               alt="Profile"
                               className="w-full h-full object-cover"
                             />
                             <div 
                               className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
 
           <h1 className="text-2xl font-bold text-center mb-2">User Profile</h1>
           <p className="text-gray-500 text-center mb-8">
             Manage your personal information
           </p>
 
           {/* User Information */}
           <div className="space-y-4">
             <div className="bg-gray-100 rounded-md p-4">
               <p className="text-sm text-gray-500 mb-1">Roll Number</p>
               <p className="font-medium">{user?.rollno}</p>
             </div>
 
             <div className="bg-gray-100 rounded-md p-4">
               <div className="flex justify-between items-center mb-1">
                 <p className="text-sm text-gray-500">Full Name</p>
                 <button
                   onClick={() => setIsEditingName((prev) => !prev)}
                   className="text-2xl text-blue-600 hover:underline"
                 >
                   <MdEdit /> {/* Edit icon from react-icons */}
                 </button>
               </div>
 
               {isEditingName ? (
                 <div className="flex items-center">
                   <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)} // Ensure the username updates on change
                     onBlur={() => setIsEditingName(false)} // auto-save on blur
                     className="font-medium w-full border border-black/30 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
                     onKeyDown={(e) => {
                       if (e.key === "Enter") {
                         setisloading(true);
                         handleNameSave(e);
                       }
                     }}
                     autoFocus
                   />
                   {isloading && (
                     <ClipLoader color="red" loading={isloading} size={20} className="ml-2" />
                   )}
                 </div>
               ) : (
                 <p className="font-medium">{username}</p>
               )}
             </div>
 
             <div className="bg-gray-100 rounded-md p-4">
               <p className="text-sm text-gray-500 mb-1">Email Address</p>
               <p className="font-medium">{user?.email}</p>
             </div>
           </div>
 
           {/* Action Buttons */}
           <div  className="mt-4 flex gap-6 flex-col">
             <button
               className="text-sm w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
               onClick={() => {
                //setting otp verification to true
                localStorage.setItem('otpVerified', 'true');
                setShowChangePassword(true);
               }}
             >
               Change Password
             </button>
             <button
               className="text-sm w-full py-3 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
               style={{ background: "#e50914" }}
               onClick={() => handleLogout()}
             >
               Log Out
             </button>
           </div>
 
           {/* Footer */}
           <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
             © 2025 FAST NUCES Lost & Found System
           </div>
         </div>
         
         {/* Change Password Modal */}
         {showForgotPassword && (
           <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
             <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
               <ChangePassword setShowChangePassword={setShowChangePassword} />
             </div>
           </div>
         )}
       </div>
       <Footer />
     </>
   );
 };
 
 export default ProfilePage;