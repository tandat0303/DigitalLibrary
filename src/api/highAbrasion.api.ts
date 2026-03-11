import axios from "axios";
import axiosConfig from "./axiosClient";
import type { HighAbrasionResponse } from "../types/highAbrasion";

export type SortOrder = "ASC" | "DESC";

interface GetAbrasionParams {
  keyword?: string;
  hasImage?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
}

const highAbrasionApi = {
  getAllMaterials: async (params: GetAbrasionParams) => {
    const res = await axiosConfig.get<HighAbrasionResponse>("/high-abrasion", {
      params,
    });
    return res.data;
  },

  createMaterial: async (formData: FormData) => {
    const res = await axiosConfig.post("/high-abrasion", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateMaterial: async (id: string, formData: FormData) => {
    const res = await axiosConfig.put(`/high-abrasion/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  deleteMaterial: async (id: string) => {
    const res = await axiosConfig.delete(`/high-abrasion/${id}`);
    return res.data;
  },

  deleteMaterialImage: async (id: string) => {
    const res = await axiosConfig.delete(`/high-abrasion/images/${id}`);
    return res.data;
  },

  importExcelFile: async (formData: FormData) => {
    const res = await axiosConfig.post("/high-abrasion/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  searchMaterial: async (formData: FormData) => {
    const res = await axios.post("http://192.168.0.32:8000/search", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  exportExcel: async (params: GetAbrasionParams) => {
    const res = await axiosConfig.get("/high-abrasion/export-excel", {
      params,
      responseType: "blob",
    });
    return res.data;
  },

  attachFile: async (formData: FormData) => {
    const res = await axiosConfig.post("/high-abrasion/attach-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  exportExcelQR: async (params: GetAbrasionParams) => {
    const res = await axiosConfig.get("/high-abrasion/export-excel-qr", {
      params,
      responseType: "blob",
    });
    return res.data;
  },

  getDetailMaterial: async (id: string) => {
    const res = await axiosConfig.get(`/high-abrasion/show-info/${id}`);
    return res.data?.[0] ?? null;
  },
};

export default highAbrasionApi;
