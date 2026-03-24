import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/users";
import type { AuthPayload } from "../types/auth";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<AuthPayload>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.data;
      state.isAuthenticated = true;
    },

    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },

    hydrateAuth(state, action: PayloadAction<AuthPayload | null>) {
      if (action.payload) {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      } else {
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
      }

      state.isHydrated = true;
    },

    updateUserInfo: (
      state,
      action: PayloadAction<Partial<typeof state.user>>,
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setToken, logout, hydrateAuth, updateUserInfo } =
  authSlice.actions;
export default authSlice.reducer;
