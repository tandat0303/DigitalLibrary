import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },

    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
    },

    hydrateAuth(state, action) {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isHydrated = true;
    },
  },
});

export const { setToken, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
