import type { UserPermissionsDataType } from "../types/users";
import axiosConfig from "./axiosConfig";

interface UserLimitParams {
  userId: string;
  moduleID: string;
}
interface SavePermissionPayload {
  userId: string;
  menuId: string;
  moduleId: string;
  level: number;
}

const userLimitApi = {
  getUserPermissions: async ({ userId, moduleID }: UserLimitParams) => {
    const res = await axiosConfig.get<UserPermissionsDataType[]>(
      "/user-permissions",
      {
        params: { userId, moduleID },
      },
    );

    return res.data;
  },

  saveUserPermissions: async (data: SavePermissionPayload) => {
    const res = await axiosConfig.post("/user-permissions/save", data);
    return res.data;
  },
};

export default userLimitApi;
