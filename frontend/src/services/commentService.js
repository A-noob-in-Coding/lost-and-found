import API from "./api";
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


