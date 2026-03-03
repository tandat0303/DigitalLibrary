import type { StorageSchema } from "../types/storage";

const storage = {
  set: <K extends keyof StorageSchema>(key: K, value: StorageSchema[K]) => {
    localStorage.setItem(key, value);
  },
  get: <K extends keyof StorageSchema>(
    key: K,
    defaultValue?: StorageSchema[K],
  ): StorageSchema[K] => {
    const value = localStorage.getItem(key);

    if (value === null || value === undefined)
      return defaultValue as StorageSchema[K];

    try {
      return value as StorageSchema[K];
    } catch {
      localStorage.removeItem(key);
      return defaultValue as StorageSchema[K];
    }
  },
  remove: (key: keyof StorageSchema) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};

export default storage;
