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
