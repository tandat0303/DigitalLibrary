import axios from "axios";
import type { MaterialsResponse } from "../types/materials";
import axiosConfig from "./axiosClient";

export type SortOrder = "ASC" | "DESC";

interface GetMaterialsParams {
  keyword?: string;
  hasImage?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortOrder;
}

const materialApi = {
  getAllMaterials: async (params: GetMaterialsParams) => {
    const res = await axiosConfig.get<MaterialsResponse>("/materials", {
      params,
    });
    return res.data;
  },

  createMaterial: async (formData: FormData) => {
    const res = await axiosConfig.post("/materials", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateMaterial: async (id: string, formData: FormData) => {
    const res = await axiosConfig.put(`/materials/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  deleteMaterial: async (id: string) => {
    const res = await axiosConfig.delete(`/materials/${id}`);
    return res.data;
  },

  deleteMaterialImage: async (id: string) => {
    const res = await axiosConfig.delete(`materials/images/${id}`);
    return res.data;
  },

  importExcelFile: async (formData: FormData) => {
    const res = await axiosConfig.post("/materials/import", formData, {
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

  exportExcel: async (params: GetMaterialsParams) => {
    const res = await axiosConfig.get("/materials/export-excel", {
      params,
      responseType: "blob",
    });
    return res.data;
  },

  attachFile: async (formData: FormData) => {
    const res = await axiosConfig.post("/materials/attach-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  exportExcelQR: async (params: GetMaterialsParams) => {
    const res = await axiosConfig.get("/materials/export-excel-qr", {
      params,
      responseType: "blob",
    });
    return res.data;
  },

  getDetailMaterial: async (id: string) => {
    const res = await axiosConfig.get(`/materials/show-info/${id}`);
    return res.data?.[0] ?? null;
  },
};

export default materialApi;
