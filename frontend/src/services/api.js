import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication services
export const authService = {
  login: async (rollno, password) => {
    try {
      const response = await API.post('/api/users/login', { rollno, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
  
  register: async (userData) => {
    try {
      const response = await API.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },
  
  verifyOtp: async (email, otp) => {
    try {
      const response = await API.post('/api/otp/verify', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  getUserDetails: async (rollno) => {
    try {
      const response = await API.get(`/api/users/${rollno}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  }
};

// Post services
export const postService = {
  getAllPosts: async () => {
    try {
      const response = await API.get('/api/user/posts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch posts' };
    }
  },
  
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      for (const key in postData) {
        if (key !== 'imageFile') {
          formData.append(key, postData[key]);
        }
      }
      
      // Append image if exists
      if (postData.imageFile) {
        formData.append('image', postData.imageFile);
      }
      
      const response = await axios.post('http://localhost:5000/api/user/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create post' };
    }
  },
  
  getUserPosts: async (userId) => {
    try {
      const response = await API.get(`/api/user/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user posts' };
    }
  }
};

// Comment services
export const commentService = {
  getPostComments: async (postId) => {
    try {
      const response = await API.get(`/comment/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch comments' };
    }
  },
  
  addComment: async (postId, comment) => {
    try {
      const response = await API.post(`/comment/${postId}`, { comment });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  }
};

export default API;
