import axios from "axios";
import axiosConfig from "./axiosClient";
import type { NewLibraryResponse } from "../types/newLibrary";

export type SortOrder = "ASC" | "DESC";

interface GetLibraryParams {
  keyword?: string;
  hasImage?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
}

const newLibraryApi = {
  getAllMaterials: async (params: GetLibraryParams) => {
    const res = await axiosConfig.get<NewLibraryResponse>("/new-library", {
      params,
    });
    return res.data;
  },

  createMaterial: async (formData: FormData) => {
    const res = await axiosConfig.post("/new-library", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateMaterial: async (id: string, formData: FormData) => {
    const res = await axiosConfig.put(`/new-library/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  deleteMaterial: async (id: string) => {
    const res = await axiosConfig.delete(`/new-library/${id}`);
    return res.data;
  },

  deleteMaterialImage: async (id: string) => {
    const res = await axiosConfig.delete(`/new-library/images/${id}`);
    return res.data;
  },

  importExcelFile: async (formData: FormData) => {
    const res = await axiosConfig.post("/new-library/import", formData, {
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

  exportExcel: async (params: GetLibraryParams) => {
    const res = await axiosConfig.get("/new-library/export-excel", {
      params,
      responseType: "blob",
    });
    return res.data;
  },

  attachFile: async (formData: FormData) => {
    const res = await axiosConfig.post("/new-library/attach-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  exportExcelQR: async (params: GetLibraryParams) => {
    const res = await axiosConfig.get("/new-library/export-excel-qr", {
      params,
      responseType: "blob",
    });
    return res.data;
  },

  getDetailMaterial: async (id: string) => {
    const res = await axiosConfig.get(`/new-library/show-info/${id}`);
    return res.data?.[0] ?? null;
  },
};

export default newLibraryApi;
