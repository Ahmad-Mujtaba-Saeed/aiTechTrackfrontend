import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../features/user/userSlice";
import resumeReducer from "../features/resume/resumeSlice";
import interviewReducer from "../features/interview/interviewSlice";
import jobReducer from "../features/job/jobSlice"

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['loading', 'error', 'AiCvLoader', 'AiSummaryLoader', 'coverletterLoader', 'emptyResumeLoader']
};

const persistedResumeReducer = persistReducer(persistConfig, resumeReducer);
const persistedJobReducer = persistReducer(persistConfig, jobReducer);
const presistInterviewReducer = persistReducer(persistConfig, interviewReducer);

export const store = configureStore({
  reducer: {
    user: userReducer,
    resume: persistedResumeReducer,
    interview: presistInterviewReducer,
    job: persistedJobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);
