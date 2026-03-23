import type { ModuleType } from "../types/users";
import axiosConfig from "./axiosConfig";

const moduleMgmtApi = {
  getAllModules: async () => {
    const res = await axiosConfig.get("/module-mgmt");
    return res.data;
  },

  createModule: async (data: ModuleType) => {
    const res = await axiosConfig.post("/module-mgmt", data);
    return res.data;
  },

  updateModule: async (id: string, data: ModuleType) => {
    const res = await axiosConfig.put(`/module-mgmt/${id}`, data);
    return res.data;
  },

  deleteModule: async (id: string) => {
    const res = await axiosConfig.delete(`/module-mgmt/${id}`);
    return res.data;
  },
};

export default moduleMgmtApi;
