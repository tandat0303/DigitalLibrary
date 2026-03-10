import type { User } from "./users";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginFormValues {
  account: string;
  password: string;
}

export interface AuthPayload {
  accessToken: string;
  data: User;
}
