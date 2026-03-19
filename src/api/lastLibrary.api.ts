import type { LastLibraryDataType } from "../types/lastLibrary";
import axiosConfig from "./axiosClient";

interface GetItemsParams {
  keyword?: string;
  hasImage?: boolean;
  page?: number;
  limit?: number;
}

export const lastLibraryApi = {
  getAllItems: async (params: GetItemsParams) => {
    const res = await axiosConfig.get("/last-library", { params });
    return res.data;
  },
  createItem: async (data: LastLibraryDataType) => {
    const res = await axiosConfig.post("/last-library", data);
    return res.data;
  },
  updateItem: async (id: string, data: LastLibraryDataType) => {
    const res = await axiosConfig.put(`/last-library/${id}`, data);
    return res.data;
  },
  deleteItem: async (id: string) => {
    const res = await axiosConfig.delete(`/last-library/${id}`);
    return res.data;
  },
};
