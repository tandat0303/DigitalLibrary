import type { UsersDataType, UsersResponse } from "../types/users";
import axiosConfig from "./axiosConfig";

interface UsersParams {
  keyword?: string;
}

const userApi = {
  getAllUsers: async (params: UsersParams) => {
    const res = await axiosConfig.get<UsersResponse>("/users", {
      params,
    });
    return res.data;
  },

  updateUser: async (id: string, data: UsersDataType) => {
    const res = await axiosConfig.put(`/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await axiosConfig.delete(`/users/${id}`);
    return res.data;
  },
};

export default userApi;
