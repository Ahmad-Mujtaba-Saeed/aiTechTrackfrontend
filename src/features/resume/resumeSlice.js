import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createEmptyUserResume, fetchUserResumeById , updateUserResumeById , uploadExistingUserResume , generateUserCvAi , analyzeUserResumeAi , generateUserCoverLetter , recentUserCvsCreated  , delUserCreatedCv , updateUserResumeName} from "./resumeAPI";
import { REHYDRATE } from 'redux-persist';


export const createEmptyResume = createAsyncThunk("resume/create-empty", 
  async (emptyResume, { rejectWithValue }) => {
    try {
      const response = await createEmptyUserResume(emptyResume);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchResumeById = createAsyncThunk("resume/fetch-by-id", 
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchUserResumeById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateResumeById = createAsyncThunk("resume/update-resume-by-id",
  async (resumeData, { rejectWithValue }) => {
    try {
      const response = await updateUserResumeById(resumeData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadExistingResume = createAsyncThunk("resume/upload-existing", 
  async (formData, { rejectWithValue }) => {
    try {
      const response = await uploadExistingUserResume(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateCvAi = createAsyncThunk("resume/generate-cv-ai", 
  async (formData, { rejectWithValue }) => {
    try {
      const response = await generateUserCvAi(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const analyzeResumeAi = createAsyncThunk("resume/analyze-resume-ai", 
  async (formData, { rejectWithValue }) => {
    try {
      const response = await analyzeUserResumeAi(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const generateCoverLetter = createAsyncThunk("coverletter/generate-cover-letter", 
  async (formData, { rejectWithValue }) => {
    try {
      const response = await generateUserCoverLetter(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getrecentCvsCreated = createAsyncThunk(
  "resume/recent-created-cvs", 
  async ({ page = 1, perPage = 3 }, { rejectWithValue }) => {
    try {
      const response = await recentUserCvsCreated({ page, perPage });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const delCreatedCv = createAsyncThunk("resume/delete-resume-created", 
  async (id, { rejectWithValue }) => {
    try {
      const response = await delUserCreatedCv(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateResumeName = createAsyncThunk("resume/update-resume-name", 
  async ({id , name}, { rejectWithValue }) => {
    try {
      const response = await updateUserResumeName({id , name});
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const resumeSlice = createSlice({
    name: "resume",
    initialState: {
      parsedResume: {},
      delResumeLoader:false,
      fetchingResumeLoader:false,
      recentCVs:[],
      recentCVsLoader:false,
      saveChangesLoader: false,
      saveRenameLoader: false,
      AiCvLoader: false,
      AiResumeLoader: false,
      selectedTemplate:"Default",
      coverletterjson:{},
      coverletterLoader:false,
      prevParsedResume:{},
      AnalyseResumeData: [],
      loading: false,
      emptyResumeLoader:false,
      error: null,
    },
    reducers: {
      setCoverLetterJson: (state,action) => {
        state.coverletterjson = action.payload
      },
      setSelectedTemplate: (state, action) => {
        state.selectedTemplate = action.payload;
      },
      setParsedResume: (state, action) => {
        state.parsedResume = action.payload;
      },
      updateField: (state, action) => {
        const { path, value } = action.payload;
        const pathParts = path.split(/[.[\]]/).filter(Boolean);
      
        // Always start from parsedResume, and ensure it’s at least {}
        if (!state.parsedResume) {
          state.parsedResume = {};
        }
      
        let current = state.parsedResume;
      
        for (let i = 0; i < pathParts.length - 1; i++) {
          const key = pathParts[i];
          const nextKey = pathParts[i + 1];
      
          if (!current[key]) {
            // If next key is a number → array, else → object
            current[key] = isNaN(nextKey) ? {} : [];
          }
      
          current = current[key];
        }
      
        const lastKey = pathParts[pathParts.length - 1];
        current[lastKey] = value;
      }          
    },
    extraReducers: (builder) => {
      // Fetch Interview History
      builder
        // Create Empty Resume
        .addCase(createEmptyResume.pending, (state) => {
          state.AnalyseResumeData = [];
          state.coverletterjson = {};
          state.emptyResumeLoader = true;
          state.error = null;
        })
        .addCase(createEmptyResume.fulfilled, (state, action) => {
          state.emptyResumeLoader = false;
          state.AnalyseResumeData = [];
          state.coverletterjson = {};
          if (action.payload?.data?.id) {
            state.parsedResume = {
              ...action.meta.arg, // The emptyResume we passed
              id: action.payload.data.id,
              template: "Default"
            };
          }
        })
        .addCase(createEmptyResume.rejected, (state, action) => {
          state.emptyResumeLoader = false;
          state.AnalyseResumeData = [];
          state.coverletterjson = {};
          state.error = action.payload || 'Failed to create empty resume';
        })
        
        // Fetch Resume By ID
        .addCase(fetchResumeById.pending, (state) => {
          state.loading = true;
          state.fetchingResumeLoader = true;
          state.AnalyseResumeData = [];
          state.error = null;
        })
        .addCase(fetchResumeById.fulfilled, (state, action) => {
          state.loading = false;
          state.AnalyseResumeData = [];
          state.selectedTemplate = action.payload?.data?.cv_resumejson?.template ?? "Default";
          if (action.payload?.data?.cv_resumejson) {
            state.prevParsedResume = action.payload.data.cv_resumejson;
            state.parsedResume = action.payload.data.cv_resumejson;
          }
          state.fetchingResumeLoader = false;
        })
        .addCase(fetchResumeById.rejected, (state, action) => {
          state.loading = false;
          state.fetchingResumeLoader = false;
          state.AnalyseResumeData = [];
          state.error = action.payload || 'Failed to fetch resume';
        })
        
        // Update Resume By ID
        .addCase(updateResumeById.pending, (state) => {
          state.saveChangesLoader = true;
          state.error = null;
        })
        .addCase(updateResumeById.fulfilled, (state, action) => {
          state.saveChangesLoader = false;
          if (action.payload?.data?.cv_resumejson) {
            state.prevParsedResume = action.payload.data.cv_resumejson;
            state.parsedResume = action.payload.data.cv_resumejson;
          }
        })
        .addCase(updateResumeById.rejected, (state, action) => {
          state.saveChangesLoader = false;
          state.error = action.payload || 'Failed to update resume';
        })
        
        // Upload Existing Resume
        .addCase(uploadExistingResume.pending, (state) => {
          state.AnalyseResumeData = [];
          state.coverletterjson = {};
          state.loading = true;
          state.error = null;
        })
        .addCase(uploadExistingResume.fulfilled, (state, action) => {
          state.AnalyseResumeData = [];
          state.coverletterjson = {};
          state.loading = false;
          if (action.payload?.data) {
            state.parsedResume = action.payload.data;
          }
        })
        .addCase(uploadExistingResume.rejected, (state, action) => {
          state.AnalyseResumeData = [];
          state.coverletterjson = {};
          state.loading = false;
          state.error = action.payload || 'Failed to upload resume';
        })

        // Generate CV AI
        .addCase(generateCvAi.pending, (state) => {
          state.AnalyseResumeData = [];
          state.coverletterjson = {};
          state.AiCvLoader = true;
          state.error = null;
        })
        .addCase(generateCvAi.fulfilled, (state, action) => {
          state.AiCvLoader = false;
          state.coverletterjson = {};
          state.AnalyseResumeData = [];
          console.log("action.payload CV AI",action.payload);
          if (action.payload?.data) {
            state.parsedResume = action.payload.data;
          }
        })
        .addCase(generateCvAi.rejected, (state, action) => {
          state.AiCvLoader = false;
          state.coverletterjson = {};
          state.AnalyseResumeData = [];
          state.error = action.payload || 'Failed to generate CV';
        })
        .addCase(analyzeResumeAi.pending, (state) => {
          state.AiResumeLoader = true;
          state.error = null;
        })
        .addCase(analyzeResumeAi.fulfilled, (state, action) => {
          state.AiResumeLoader = false;
          console.log("action.payload analyze Resume AI",action.payload);
          state.AnalyseResumeData = action.payload.data;
        })
        .addCase(analyzeResumeAi.rejected, (state, action) => {
          state.AiResumeLoader = false;
          state.error = action.payload || 'Failed to generate CV';
        })
        .addCase(generateCoverLetter.pending, (state) => {
          state.coverletterLoader = true;
          state.error = null;
        })
        .addCase(generateCoverLetter.fulfilled, (state, action) => {
          state.coverletterLoader = false;
          console.log("action.payload analyze Resume AI",action.payload);
          state.coverletterjson = action.payload;
        })
        .addCase(generateCoverLetter.rejected, (state, action) => {
          state.coverletterLoader = false;
          state.error = action.payload || 'Failed to generate CV';
        })
        .addCase(getrecentCvsCreated.pending, (state) => {
          state.recentCVsLoader = true;
          state.error = null;
        })
        .addCase(getrecentCvsCreated.fulfilled, (state, action) => {
          state.recentCVsLoader = false;
          state.recentCVs = action.payload;
        })
        .addCase(getrecentCvsCreated.rejected, (state, action) => {
          state.recentCVsLoader = false;
          state.error = action.payload || 'Failed to generate CV';
        })
        .addCase(delCreatedCv.pending, (state) => {
          state.delResumeLoader = true;
          state.error = null;
        })
        .addCase(delCreatedCv.fulfilled, (state, action) => {
          state.delResumeLoader = false;
          state.recentCVs = action.payload.data;
          state.success = action.payload.message;
        })
        .addCase(delCreatedCv.rejected, (state, action) => {
          state.delResumeLoader = false;
          state.error = action.payload.message || 'Failed to generate CV';
        })
        .addCase(updateResumeName.pending, (state) => {
          state.saveRenameLoader = true;
          state.error = null;
        })
        .addCase(updateResumeName.fulfilled, (state, action) => {
          state.saveRenameLoader = false;
        })
        .addCase(updateResumeName.rejected, (state, action) => {
          state.saveRenameLoader = false;
          state.error = action.payload || 'Failed to update resume';
        })
        .addCase(REHYDRATE, (state) => {
          state.loading = false;
          state.AiCvLoader = false;
          state.emptyResumeLoader = false;
          state.error = null;
          state.success = "";
        })
    }
  });
  

export const { setParsedResume , updateField , setSelectedTemplate , setCoverLetterJson } = resumeSlice.actions;
export default resumeSlice.reducer;
