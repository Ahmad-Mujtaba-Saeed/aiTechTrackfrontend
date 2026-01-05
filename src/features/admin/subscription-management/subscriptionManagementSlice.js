import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllSubscriptions } from "./subscriptionManagementApi";
import { REHYDRATE } from 'redux-persist';

export const getAllSubscriptions = createAsyncThunk("subscriptionManagement/getAllSubscriptions", async ({ page = 1, search = '', status = '', per_page = 10 }) => {
  return await fetchAllSubscriptions({ page, search, status, per_page });
});

const subscriptionManagementSlice = createSlice({
  name: "subscriptionManagement",
  initialState: {
    subscriptions: [],
    uniqueStatuses: [],
    loading: false,
    error: null,
    bootstrapping: true
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
          .addCase(getAllSubscriptions.pending, (state) => { state.loading = true; })
          .addCase(getAllSubscriptions.fulfilled, (state, action) => {
            state.loading = false;
            state.subscriptions = action.payload.subscriptions;
            state.uniqueStatuses = action.payload.unique_statuses || [];
          })
          .addCase(getAllSubscriptions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
            .addCase(REHYDRATE, (state) => {
              state.loading = false;
              state.bootstrapping = false;
              state.error = null;
            })
      }
    })
    
export default subscriptionManagementSlice.reducer;