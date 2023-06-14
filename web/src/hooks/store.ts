import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import sidebarReducer from "./slices/sidebarSlice";
import profileReducer from "./slices/profileSlice";
import settingsReducer from "./slices/settingsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer,
    profile: profileReducer,
    settings: settingsReducer
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch