import axios from "../../api/axios";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post("/register", userData);
    return response.data;
  } catch (error) {
    // This will be caught by createAsyncThunk's rejected action
    throw error.response?.data || { message: 'Registration failed. Please try again.' };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post("/login", userData);
    return response.data;
  } catch (error) {
    // This will be caught by createAsyncThunk's rejected action
    throw error.response?.data || { message: 'Login failed. Please try again.' };
  }
};

export const fetchUser = async () => {
  const response = await axios.get("/user"); // e.g. /me endpoint
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await axios.post("/upload-profile", userData);
  return response.data;
};

export const getAllIndustries = async () => {
  const response = await axios.get("/get-industries");
  return response.data;
};

export const getAllRoles = async () => {
  const response = await axios.get("/get-roles");
  return response.data;
};

export const getAllEducationLevels = async () => {
  const response = await axios.get("/get-education-levels");
  return response.data;
};

export const getAllUserCompletedSteps = async () => {
  const response = await axios.get("/completed-steps");
  return response.data;
};

export const updateUserCompletedSteps = async (formData) => {
  const response = await axios.post('/update-steps', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

export const updateUserProfileSettings = async (formData) => {
  const response = await axios.post('/profile-settings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

export const updateUserCurrentPassword = async (formData) => {
  const response = await axios.post('/change-password', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

export const userGoogleSignIn = async (formData) => {
  const response = await axios.post('/auth/firebase', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

export const userForgotPassword = async (formData) => {
  try {
    const response = await axios.post('/password/email', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    // Throw an error with the server's error message or a default message
    const errorMessage = error.response?.data?.message || 
                       (error.response?.data?.errors ? 
                        Object.values(error.response.data.errors).flat().join(' ') : 
                        'Failed to send password reset email');
    throw new Error(errorMessage);
  }
}
export const userResetPassword = async (resetData) => {
  const response = await axios.post('/password/reset', resetData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
