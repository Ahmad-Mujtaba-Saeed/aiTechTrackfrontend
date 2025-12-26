import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchInterviewUserHistory , fetchUserInterviewQuestions , fetchUserInterviewQuestionById , fetchRandomInterviewQuestions } from "./interviewAPI";


export const fetchInterviewHistory = createAsyncThunk("interview/history", async () => {
  return await fetchInterviewUserHistory();
});

export const fetchInterviewQuestions = createAsyncThunk(
  "interview/questions", 
  async (_, { getState }) => {
    const state = getState();
    return await fetchUserInterviewQuestions(state.interview.filters);
  }
);


export const fetchInterviewQuestionById = createAsyncThunk("interview/question-by-id", async (id) => {
  return await fetchUserInterviewQuestionById(id);
});


export const getRandomQuestions = createAsyncThunk("interview/random-questions", async (_, { rejectWithValue }) => {
  try {
    console.log("Dispatching getRandomQuestions action");
    const response = await fetchRandomInterviewQuestions();
    console.log("Received response in getRandomQuestions:", response);
    return response;
  } catch (error) {
    console.error("Error in getRandomQuestions:", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

const interviewSlice = createSlice({
    name: "interview",
    initialState: {
      filters: {
        difficulty: null,
        questionType: null,
        subcategory: null,
        searchQuery: ""
      },
      history: null,
      parsedFeedback:null,
      interviewQuestions: null,
      currentQuestion: null,
      loading: false,
      error: null,
    },
    reducers: {
      setFilters: (state, action) => {
        state.filters = action.payload
      },
      setParsedFeedback: (state , action) => {
        state.parsedFeedback = action.payload
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchInterviewHistory.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchInterviewHistory.fulfilled, (state, action) => {
          state.loading = false;
          state.history = action.payload;
        })
        .addCase(fetchInterviewHistory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(fetchInterviewQuestions.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchInterviewQuestions.fulfilled, (state, action) => {
          state.loading = false;
          state.interviewQuestions = action.payload;
        })
        .addCase(fetchInterviewQuestions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(getRandomQuestions.pending, (state) => {
          state.loading = true;
        })
        .addCase(getRandomQuestions.fulfilled, (state, action) => {
          state.loading = false;
          state.interviewQuestions = action.payload;
        })
        .addCase(getRandomQuestions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(fetchInterviewQuestionById.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchInterviewQuestionById.fulfilled, (state, action) => {
          state.loading = false;
          state.currentQuestion = action.payload;
        })
        .addCase(fetchInterviewQuestionById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
  });
  

export const { setFilters ,setParsedFeedback } = interviewSlice.actions;
export default interviewSlice.reducer;
