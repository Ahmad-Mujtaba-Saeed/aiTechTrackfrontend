import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllTransactions } from "./transactionManagementApi";
import { REHYDRATE } from 'redux-persist';

export const getAllTransactions = createAsyncThunk("transactionManagement/getAllTransactions", async ({page = 1, search = '', payment_status = ''}) => {
  return await fetchAllTransactions(page, search, payment_status);
});

const transactionManagementSlice = createSlice({
  name: "transactionManagement",
  initialState: {
    transactions: [],
    payment_status: [],
    loading: false,
    error: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTransactions.pending, (state) => { state.loading = true; })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.payment_status = action.payload.payment_status;
        state.transactions = action.payload.payments;
      })
      .addCase(getAllTransactions.rejected, (state, action) => {
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

export default transactionManagementSlice.reducer;