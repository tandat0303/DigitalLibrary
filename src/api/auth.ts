import type { LoginResponse } from "../types/auth";
import { apiClient } from "./apiClient";

export const authAPI = {
  login(account: string, password: string) {
    return apiClient<LoginResponse>("/data_login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        account,
        password,
      },
    });
  },
};
