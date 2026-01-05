import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllCoreCredentials , deleteCoreCredentialApi , updateOrCreateCoreCredentialApi } from "./coreSettingsManagementApi";
import { REHYDRATE } from 'redux-persist';


export const getAllCoreCredentials = createAsyncThunk("coreSettingsManagement/getAllCoreCredentials", async () => {
  return await fetchAllCoreCredentials();
});

export const deleteCoreCredential = createAsyncThunk("coreSettingsManagement/deleteCoreCredential", async (key) => {
  return await deleteCoreCredentialApi(key);
});

export const updateOrCreateCoreCredential = createAsyncThunk("coreSettingsManagement/updateOrCreateCoreCredential", async (formData) => {
  return await updateOrCreateCoreCredentialApi(formData);
});

const coreSettingsManagementSlice = createSlice({
  name: "coreSettingsManagement",
  initialState: {
    coreSettings: [],
    loading: false,
    error: null,
    bootstrapping: true
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoreCredentials.pending, (state) => { state.loading = true; })
      .addCase(getAllCoreCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.coreSettings = action.payload;
      })
      .addCase(getAllCoreCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       .addCase(deleteCoreCredential.pending, (state) => { state.loading = true; })
      .addCase(deleteCoreCredential.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteCoreCredential.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrCreateCoreCredential.pending, (state) => { state.loading = true; })
      .addCase(updateOrCreateCoreCredential.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateOrCreateCoreCredential.rejected, (state, action) => {
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

export default coreSettingsManagementSlice.reducer;