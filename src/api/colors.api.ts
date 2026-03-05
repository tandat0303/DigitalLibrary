import axiosConfig from "./axiosClient";

const colorApi = {
  getAllColors: async () => {
    const res = await axiosConfig.get("/colors");
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
};

export default colorApi;
