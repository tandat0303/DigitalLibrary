import type { ColorsResponse } from "../types/colors";
import axiosConfig from "./axiosConfig";

export type SortOrder = "ASC" | "DESC";

interface GetColorsParams {
  keyword?: string;
  colorGroup?: string;
  hasImage?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
}

const colorApi = {
  getAllColors: async (params: GetColorsParams) => {
    const res = await axiosConfig.get<ColorsResponse>("/colors", { params });
    return res.data;
  },

  createColor: async (formData: FormData) => {
    const res = await axiosConfig.post("/colors", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateColor: async (id: string, formData: FormData) => {
    const res = await axiosConfig.put(`/colors/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  deleteColor: async (id: string) => {
    const res = await axiosConfig.delete(`/colors/${id}`);
    return res.data;
  },

  deleteColorImage: async (id: string) => {
    const res = await axiosConfig.delete(`colors/images/${id}`);
    return res.data;
  },

  importExcelFile: async (formData: FormData) => {
    const res = await axiosConfig.post("/colors/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};

export default colorApi;
