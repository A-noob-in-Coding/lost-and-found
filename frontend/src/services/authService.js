import API from "./api";
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

  getUserDetails: async (rollno) => {
    try {
      const response = await API.get(`/api/users/${rollno}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  },

  updateUsername: async (rollno, newUsername) => {
    try {
      const response = await API.put(`/api/users/updateusername`, {
        rollno, username: newUsername,
      });
      return response.data;
    }
    catch (error) {
      throw error.response?.data || { message: 'Failed to update username' };
    }
  },

  updateCampus: async (rollno, campusID) => {
    try {
      await API.post(`/api/users/update/campus`, {
        rollno, campusID
      });
      return;
    }
    catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  },
  updateProfileImage: async (rollno, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('imageFile', imageFile);
      formData.append('rollno', rollno);

      const response = await API.post('/api/users/update-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data; // contains { image_url }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile image' };
    }
  },
  resendOtp: async (email) => {
    try {
      const response = await API.post("/api/otp/send-otp", { email });
      return response.data; // backend response
    } catch (error) {
      throw error.response?.data || { message: "Failed to resend OTP" };
    }
  },
  verifyOtp: async (email, otp) => {
    try {
      const response = await API.post("/api/otp/verify-otp", { email, otp });
      return response.data; // backend response
    } catch (error) {
      throw error.response?.data || { message: "Failed to verify OTP" };
    }
  },

  register: async (formData) => {
    try {
      const response = await API.post("/api/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // backend response
    } catch (error) {
      throw error.response?.data || { message: "Failed to register" };
    }
  },
  changePassword: async (email, password) => {
    try {
      const response = await API.post("/api/users/changePassword", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to reset password" };
    }
  },
  async getUserByRollNumber(rollNumber) {
    const res = await API.get(`api/users/${rollNumber}`);
    return res.data;
  },
};


