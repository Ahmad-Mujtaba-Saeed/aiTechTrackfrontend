import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllPlans } from "./PlanManagementApi";
import { REHYDRATE } from 'redux-persist';

export const getAllPlans = createAsyncThunk("planManagement/get-all-plans", async ({page = 1, search = ''}) => {
  return await fetchAllPlans(page, search);
});

const planManagementSlice = createSlice({
  name: "planManagement",
  initialState: {
    plans:[],
    loading: false,
    error: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPlans.pending, (state) => { state.loading = true; })
      .addCase(getAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.data
      })
      .addCase(getAllPlans.rejected, (state, action) => {
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

export default planManagementSlice.reducer;