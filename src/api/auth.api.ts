import type { LoginPayload } from "../types/auth";
import axiosClient from "./axiosClient";

const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await axiosClient.post("/auth/login", payload);
    return res.data;
  },
};

export default authApi;
