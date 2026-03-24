import axiosConfig from "./axiosConfig";

interface ScanQrParams {
  id?: string;
}

const scanQrApi = {
  materialQR: async (params: ScanQrParams) => {
    const res = await axiosConfig.post("/materials/redirect", params);
    return res.data;
  },
};

export default scanQrApi;
