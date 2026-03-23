import type { UserPermissionsDataType } from "../types/users";
import axiosConfig from "./axiosConfig";

interface UserLimitParams {
  userId: string;
}

const userLimitApi = {
  getUserPermissions: async ({ userId }: UserLimitParams) => {
    const res = await axiosConfig.get("/user-permissions", {
      params: { userId },
    });

    return res.data;
  },

  saveUserPermissions: async (data: UserPermissionsDataType) => {
    const res = await axiosConfig.post("/user-permissions/save", data);
    return res.data;
  },
};

export default userLimitApi;
