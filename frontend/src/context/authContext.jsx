import { createContext, useContext, useState, useEffect } from "react";
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Add useEffect to monitor user state changes
  useEffect(() => {
    if (user) {
      console.log('Updated User Details:', {
        name: user.name,
        email: user.email,
        rollNo: user.rollno,
        imageUrl: user.image_url
      });
    }
  }, [user]); // This will run whenever user state changes

  const updateUsername = async (newUsername) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/updateusername`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rollno: user.rollno, // Send the rollno to identify the user
          username: newUsername,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update username');
      }

      const updatedUser = { ...user, name: newUsername };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error(error.message);
    }
  };

  const login = async (rollno, password) => {
    setLoading(true);
    try {
      // First, authenticate the user
      const loginResponse = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollno, password }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // If authentication successful, fetch user details
      const userDetailsResponse = await fetch(`http://localhost:5000/api/users/${rollno}`);
      
      if (!userDetailsResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userDetails = await userDetailsResponse.json();

      // Store user data without password
      const userData = {
        rollno: userDetails.rollno,
        email: userDetails.email,
        name: userDetails.name,
        image_url: userDetails.image_url
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Successfully logged in!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
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