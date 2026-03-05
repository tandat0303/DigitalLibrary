import type { UploadImage } from "../components/ImageUploader";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const requiredMessage = "Please do not leave it blank";

export const THUMBNAIL_COUNT = 2;

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
