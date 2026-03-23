import type { MenuType } from "../types/users";
import axiosConfig from "./axiosConfig";

const menuMgmtApi = {
  getAllMenus: async () => {
    const res = await axiosConfig.get("/menu-mgmt");
    return res.data;
  },

  createMenu: async (data: MenuType) => {
    const res = await axiosConfig.post("/menu-mgmt", data);
    return res.data;
  },

  updateMenu: async (id: string, data: MenuType) => {
    const res = await axiosConfig.put(`/menu-mgmt/${id}`, data);
    return res.data;
  },

  deleteMenu: async (id: string) => {
    const res = await axiosConfig.delete(`/menu-mgmt/${id}`);
    return res.data;
  },
};

export default menuMgmtApi;
