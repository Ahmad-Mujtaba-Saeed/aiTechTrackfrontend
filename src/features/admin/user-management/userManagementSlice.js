import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllUsers, fetchUserSubscriptionDetails , toggleUserActiveStatusApi} from "./userManagementApi";
import { REHYDRATE } from 'redux-persist';

export const getAllUsers = createAsyncThunk("userManagement/getAllUsers", async ({page = 1, search = ''}) => {
  return await fetchAllUsers(page, search);
});

export const getUserSubscriptionDetails = createAsyncThunk("userManagement/getUserSubscriptionDetails", async (userId) => {
  return await fetchUserSubscriptionDetails(userId);
});

export const toggleUserActiveStatus = createAsyncThunk("userManagement/toggleUserActiveStatus", async (userId) => {
  return await toggleUserActiveStatusApi(userId);
});

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState: {
    users: [],
    subscriptionDetails: [],
    loading: false,
    togglingUser: false,      // Dedicated flag for toggle
    error: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => { state.loading = true; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserSubscriptionDetails.pending, (state) => { state.loading = true; })
      .addCase(getUserSubscriptionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionDetails = action.payload;
      })
      .addCase(getUserSubscriptionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
        .addCase(toggleUserActiveStatus.pending, (state) => {
        state.togglingUser = true;
        })
        .addCase(toggleUserActiveStatus.fulfilled, (state, action) => {
        state.togglingUser = false;
        state.users = state.users.map(u =>
            u.id === action.payload.user.id ? action.payload.user : u
        );
        })
        .addCase(toggleUserActiveStatus.rejected, (state, action) => {
        state.togglingUser = false;
        state.error = action.error.message;
        })
        .addCase(REHYDRATE, (state) => {
          state.loading = false;
          state.bootstrapping = false;
          state.error = null;
        })
  }
})

export default userManagementSlice.reducer;