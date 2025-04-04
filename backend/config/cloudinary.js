import { v2 as cloudinary } from 'cloudinary';
import { configDotenv } from 'dotenv';
import { Readable } from 'stream';

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload file from multer
export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "lost-and-found",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(new Error("Image upload failed"));
        resolve(result.secure_url);
      }
    );

    // Create a readable stream from the buffer
    const readable = new Readable();
    readable._read = () => {};
    
    // Use file.buffer if it exists (from multer's memoryStorage)
    // Otherwise, try using the file itself if it's already a buffer
    const buffer = file.buffer || file;
    
    if (Buffer.isBuffer(buffer)) {
      readable.push(buffer);
      readable.push(null);
      readable.pipe(stream);
    } else {
      reject(new Error("Invalid file format: Buffer expected"));
    }
  });
};

// First, let's add a better version of getPublicIdFromUrl
const getPublicIdFromUrl = (imageUrl) => {
  // Check if imageUrl is a string
  if (typeof imageUrl !== 'string') {
    console.warn("Invalid image URL type:", typeof imageUrl);
    return null;
  }
  
  try {
    // Example Cloudinary URL: https://res.cloudinary.com/cloud-name/image/upload/v1234567/folder/filename.jpg
    
    // First, check if this is actually a Cloudinary URL
    if (!imageUrl.includes('cloudinary.com')) {
      console.warn("Not a Cloudinary URL:", imageUrl);
      return null;
    }
    
    // Split the URL by "/" and find the upload part
    const parts = imageUrl.split('/');
    
    // Find the upload index (should be after cloudinary domain)
    const uploadIndex = parts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      console.warn("Cannot find 'upload' in URL:", imageUrl);
      return null;
    }
    
    // The public ID starts after the version number (which starts with v)
    // Find the version number index (should be after 'upload')
    const versionParts = parts.slice(uploadIndex + 1);
    const versionIndex = versionParts.findIndex(part => part.startsWith('v'));
    
    if (versionIndex === -1) {
      // Sometimes Cloudinary URLs might not have explicit version numbers
      // In this case, everything after 'upload' is the public ID
      const publicId = parts.slice(uploadIndex + 1).join('/').replace(/\.\w+$/, '');
      console.log("Extracted public ID (no version):", publicId);
      return publicId;
    }
    
    // If there's a version number, the public ID starts after it
    const publicId = parts.slice(uploadIndex + versionIndex + 2).join('/').replace(/\.\w+$/, '');
    console.log("Extracted public ID (with version):", publicId);
    return publicId;
  } catch (error) {
    console.error("Error parsing image URL:", error, "URL:", imageUrl);
    return null;
  }
};
// Better deleteFromCloudinary function
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Check if imageUrl exists
    if (!imageUrl) {
      console.warn("No image URL provided for deletion");
      return false;
    }
    
    console.log("Attempting to delete from Cloudinary:", imageUrl);
    
    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) {
      console.warn("Could not extract public ID from URL:", imageUrl);
      // Return true to avoid blocking the post deletion process
      return true;
    }
    
    console.log("Deleting Cloudinary resource with public ID:", publicId);
    
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary deletion result:", result);
    
    // Cloudinary returns "ok" for successful deletion
    return result === "ok" || result.result === "ok";
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    // Return true to avoid blocking post deletion due to image deletion failure
    return true;
  }
};
