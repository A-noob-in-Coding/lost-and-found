import API from "./api";
// Post services

export const postService = {
  getAllPosts: async () => {
    try {
      const response = await API.get('/api/user/posts/getPostData');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch posts' };
    }
  },

  createPost: async (formData, postType) => {
    try {
      const response = await API.post(`/api/user/posts/${postType}`, formData);
      return response.data
    } catch (error) {
      throw error.response?.data || { message: `Failed to create ${postType} post` };
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

