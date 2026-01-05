import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../features/user/userSlice";
import resumeReducer from "../features/resume/resumeSlice";
import userManagementReducer from "../features/admin/user-management/userManagementSlice"
import transactionManagementReducer from "../features/admin/transaction-management/transactionManagementSlice"
import coreSettingsManagementReducer from "../features/admin/core-settings-mangement/coreSettingsManagementSlice"
import subscriptionManagementReducer from "../features/admin/subscription-management/subscriptionManagementSlice"

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['loading', 'error', 'AiCvLoader', 'AiSummaryLoader', 'coverletterLoader', 'emptyResumeLoader']
};

const persistedResumeReducer = persistReducer(persistConfig, resumeReducer);
const persistedUserManagementReducer = persistReducer(persistConfig, userManagementReducer);
const persistedTransactionManagementReducer = persistReducer(persistConfig, transactionManagementReducer);
const persistedCoreSettingsManagementReducer = persistReducer(persistConfig, coreSettingsManagementReducer);
const persistedSubscriptionManagementReducer = persistReducer(persistConfig, subscriptionManagementReducer);

export const store = configureStore({
  reducer: {
    user: userReducer,
    resume: persistedResumeReducer,
    userManagement: persistedUserManagementReducer,
    transactionManagement: persistedTransactionManagementReducer,
    coreSettingsManagement: persistedCoreSettingsManagementReducer,
    subscriptionManagement: persistedSubscriptionManagementReducer,
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
