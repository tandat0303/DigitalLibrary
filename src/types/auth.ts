export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface LoginFormValues {
  account: string;
  password: string;
}
