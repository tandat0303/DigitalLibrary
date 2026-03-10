import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import storage from "../lib/storage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();

  const { accessToken, user } = state.auth;

  if (accessToken && user) {
    storage.set("auth", {
      accessToken,
      data: user,
    });
  } else {
    storage.remove("auth");
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
