import { createContext, useContext, useState } from "react";
import toast from 'react-hot-toast';
import { authService } from "../services/authService";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const updateProfileImage = async (imageFile) => {
    try {
      const data = await authService.updateProfileImage(user.rollno, imageFile);

      const updatedUser = { ...user, image_url: data.image_url };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Profile picture updated successfully!');
      return data.image_url;
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error(error.message || 'Failed to update profile image');
      throw error;
    }
  };
  const updateUsername = async (newUsername) => {
    try {
      await authService.updateUsername(user.rollno, newUsername)
      const updatedUser = { ...user, name: newUsername };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error(error.message);
    }
  };
  const updateCampus = async (campusID, campusName) => {
    try {
      await authService.updateCampus(user.rollno, campusID)
      toast.success("Campus updated")
      setUser((prevUser) => ({
        ...prevUser,
        campusName: campusName,
        campusID: campusID,
      }));
    }
    catch (error) {
      toast.error("Could not update campus")
    }

  }
  const login = async (rollno, password) => {
    setLoading(true);
    try {
      await authService.login(rollno, password);

      const userDetails = await authService.getUserDetails(rollno);

      const userData = {
        rollno: userDetails.rollno,
        email: userDetails.email,
        name: userDetails.name,
        image_url: userDetails.image_url,
        campusID: userDetails.campusID,
        campusName: userDetails.campusName,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Successfully logged in!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      updateUsername,
      updateProfileImage,
      updateCampus,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

