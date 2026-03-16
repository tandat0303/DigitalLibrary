import type { ColumnsType, ColumnType } from "antd/es/table";
import type { UploadImage } from "../components/ImageUploader";
import type { Image } from "../types/images";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const requiredMessage = "Please do not leave it blank";

export const THUMBNAIL_COUNT = 2;

export const IMAGE_FIELD_MAP: Record<string, string> = {
  "Top side": "topImage",
  "Bottom side": "bottomImage",
};

export const IMAGE_LABELS = Object.keys(IMAGE_FIELD_MAP);

export const IMAGE_ORDER: Record<string, number> = {
  TopSide: 0,
  BottomSide: 1,
};

export const sortImagesByType = (
  images?: (Image | File | null)[],
): (Image | File | null)[] => {
  if (!images) return [];

  return [...images].sort((a, b) => {
    const getOrder = (img: Image | File | null) => {
      if (!img) return 999;

      if (img instanceof File) return 998;

      return IMAGE_ORDER[img.ImageType ?? ""] ?? 999;
    };

    return getOrder(a) - getOrder(b);
  });
};

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export function resolveImageSrc(image: UploadImage) {
  if (!image) return "";

  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  return image.ImagePath;
}

export function normalizeImages(
  value: UploadImage[] | undefined,
  max: number,
): UploadImage[] {
  const list = value ? [...value] : [];

  while (list.length < max) {
    list.push(null);
  }

  return list.slice(0, max);
}

export function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function dataURItoBlob(dataURI: string) {
  if (!dataURI) return null;

  const [header, base64] = dataURI.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";

  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mime });
}

export const displayValue = (value?: any) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "undefined" ||
    value === "null" ||
    value === "N/A"
  )
    return "No data";

  return value;
};

export const normalizeValue = (value: unknown) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "undefined" ||
    value === "null" ||
    value === "N/A"
  ) {
    return "";
  }

  if (typeof value === "string" && value.trim() === "") {
    return "";
  }

  return value;
};

export function normalizeColumns<T>(
  columns: ColumnsType<T>,
  excludeKeys: string[] = [],
): ColumnsType<T> {
  return columns.map((col) => {
    const column = col as ColumnType<T> & { dataIndex?: string };

    if (
      !column.dataIndex ||
      column.render ||
      excludeKeys.includes(column.dataIndex as string)
    ) {
      return column;
    }

    return {
      ...column,
      render: (value: unknown) => normalizeValue(value),
    };
  });
}

export const normalizeRGB = (value?: string) => {
  if (!value) return undefined;

  const rgb = value.replace(/[[\]]/g, "").replace(/\s+/g, "");

  return /^\d{1,3},\d{1,3},\d{1,3}$/.test(rgb) ? rgb : undefined;
};

const formatImageType = (label?: string) => {
  if (!label) return "";

  return label
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
};

export const mapImagesToLabels = (
  images: (File | Image | null)[] | undefined,
  labels: string[],
  max: number,
) => {
  const result = new Array(max).fill(null);

  if (!images) return result;

  images.forEach((img) => {
    if (!img || img instanceof File) return;

    const index = labels.findIndex((l) => formatImageType(l) === img.ImageType);

    if (index !== -1) {
      result[index] = img;
    }
  });

  return result;
};

export function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
