import type { User } from "./users";

export interface StorageSchema {
  auth: {
    accessToken: string;
    data: User;
  };
}
