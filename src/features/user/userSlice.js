import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, fetchUser, updateUserProfile, getAllIndustries, getAllRoles , getAllEducationLevels , getAllUserCompletedSteps ,updateUserCompletedSteps , updateUserProfileSettings ,userForgotPassword , userResetPassword , updateUserCurrentPassword , userGoogleSignIn} from "./userAPI";
import { REHYDRATE } from 'redux-persist';



export const register = createAsyncThunk("user/register", async (userData) => {
  return await registerUser(userData);
});

export const login = createAsyncThunk("user/login", async (userData) => {
  return await loginUser(userData);
});

export const getUser = createAsyncThunk("user/getUser", async () => {
  return await fetchUser();
});

export const updateUserPro = createAsyncThunk("user/updateUserProfile", async (userData) => {
  return await updateUserProfile(userData);
});

export const getIndustries = createAsyncThunk("user/getIndustries", async () => {
  return await getAllIndustries();
});

export const getRoles = createAsyncThunk("user/getRoles", async () => {
  return await getAllRoles();
});

export const getEducationLevels = createAsyncThunk("user/getEducationLevels", async () => {
  return await getAllEducationLevels();
});

export const getAllCompletedSteps = createAsyncThunk("user/get-All-completed-steps", async () => {
  return await getAllUserCompletedSteps();
});

export const updateCompletedSteps = createAsyncThunk(
  "user/update-completed-steps",  // Fixed typo: was "udpate"
  async (formData) => {
    return await updateUserCompletedSteps(formData);
  }
);

export const updateProfileSettings = createAsyncThunk(
  "user/update-profile-settings",  // Fixed typo: was "udpate"
  async (formData) => {
    return await updateUserProfileSettings(formData);
  }
);


export const updateCurrentPassword = createAsyncThunk(
  "user/update-current-password",  // Fixed typo: was "udpate"
  async (formData) => {
    return await updateUserCurrentPassword(formData);
  }
);

export const googleSignIn = createAsyncThunk(
  "user/google-sign-in",
  async (formData) => {
    return await userGoogleSignIn(formData);
  }
);




export const ForgotPassword = createAsyncThunk(
  "user/forgot-password-email",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await userForgotPassword(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// 2. In userSlice.js, add the thunk
export const resetPassword = createAsyncThunk(
  "user/reset-password",
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await userResetPassword(resetData);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         (error.response?.data?.errors ? 
                          Object.values(error.response.data.errors).flat().join(' ') : 
                          'Failed to reset password');
      return rejectWithValue(errorMessage);
    }
  }
);



const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    industries: [],
    roles: [],
    educationLevels: [],
    completedSteps: null,
    loading: false,
    bootstrapping: false,
    error: null,
    accessToken: null,
    success: "",
    forgetPasswordError:"",
    forgetPasswordSuccess:""
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      state.accessToken = null;
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user;
        state.accessToken = action.payload.access_token;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        // The error payload is already formatted by the API
        state.error = action.error.message || 'Registration failed. Please try again.';
        // Re-throw the error to be caught by the component
        throw action.error;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors when starting a new login attempt
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.user;
        state.accessToken = action.payload.access_token;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        // The error payload is already formatted by the API
        state.error = action.error?.message || 'Login failed. Please check your credentials and try again.';
        // Don't re-throw the error here as it's already handled in the component
      })
      .addCase(getUser.pending, (state) => { state.bootstrapping = true; })
      .addCase(getUser.fulfilled, (state, action) => {
        state.bootstrapping = false;
        state.data = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.bootstrapping = false;
        state.error = action.error.message;
      })
      .addCase(getIndustries.pending, (state) => { state.loading = true; })
      .addCase(getIndustries.fulfilled, (state, action) => {
        state.loading = false;
        state.industries = action.payload;
      })
      .addCase(getIndustries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getRoles.pending, (state) => { state.loading = true; })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getEducationLevels.pending, (state) => { state.loading = true; })
      .addCase(getEducationLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.educationLevels = action.payload;
      })
      .addCase(getEducationLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserPro.pending, (state) => { state.loading = true; })
      .addCase(updateUserPro.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Profile updated successfully";
      })
      .addCase(updateUserPro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllCompletedSteps.pending, (state) => { 
        // state.completedSteps = [];
        state.loading = true;
      })
      .addCase(getAllCompletedSteps.fulfilled, (state, action) => {
        state.loading = false;
        state.completedSteps = action.payload;
        state.success = "Profile updated successfully";
      })
      .addCase(getAllCompletedSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCompletedSteps.pending, (state) => { 
        // state.completedSteps = [];
        state.loading = true;
      })
      .addCase(updateCompletedSteps.fulfilled, (state, action) => {
        state.loading = false;
        state.completedSteps = action.payload;
        state.success = "steps updated successfully";
      })
      .addCase(updateCompletedSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfileSettings.pending, (state) => { 
        // state.completedSteps = [];
        state.loading = true;
      })
      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user;
        state.success = "Profile updated successfully";
      })
      .addCase(updateProfileSettings.rejected, (state, action) => {
        state.loading = false;
        state.forgetPasswordError = action.error.message;
      })
      // In your extraReducers:
      .addCase(ForgotPassword.pending, (state) => {
        state.loading = true;
        state.forgetPasswordError = null;
        state.forgetPasswordSuccess = null;
      })
      .addCase(ForgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgetPasswordSuccess = action.payload.message;
        state.forgetPasswordError = null;
      })
      .addCase(ForgotPassword.rejected, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.forgetPasswordError = action.payload || 'Failed to send reset email';
        state.forgetPasswordSuccess = null;
      })
      
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.forgetPasswordError = null;
        state.forgetPasswordSuccess = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgetPasswordSuccess = action.payload.message || 'Password reset successful';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgetPasswordError = action.payload || 'Failed to reset password';
      })
      .addCase(updateCurrentPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCurrentPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCurrentPassword.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.accessToken = action.payload.token;
        localStorage.setItem("access_token", action.payload.token);
        state.loading = false;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(REHYDRATE, (state) => {
        state.loading = false;
        state.bootstrapping = false;
        state.error = null;
        state.success = "";
      })
      
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
