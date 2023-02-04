import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import sidebarReducer from "./slices/sidebarSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch