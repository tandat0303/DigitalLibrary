import type { LoginPayload } from "../types/auth";
import type { UsersDataType } from "../types/users";
import axiosConfig from "./axiosConfig";

const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await axiosConfig.post("/auth/login", payload);
    return res.data;
  },

  register: async (data: UsersDataType) => {
    const res = await axiosConfig.post("/auth/register", data);
    return res.data;
  },
};

export default authApi;
