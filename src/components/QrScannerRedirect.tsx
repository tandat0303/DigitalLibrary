import { useEffect, useRef } from "react";

interface QrScannerRedirectProps {
  validate?: (value: string) => boolean;
  onScan?: (value: string) => void;
  openInNewTab?: boolean;
  endTimeout?: number;
  noRedirect?: boolean;
}

export default function QrScannerRedirect({
  validate,
  onScan,
  openInNewTab = true,
  endTimeout = 100,
  noRedirect = false,
}: QrScannerRedirectProps) {
  const bufferRef = useRef("");
  const lastTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const defaultValidate = (value: string) => /^http?:\/\/.+/i.test(value);

  useEffect(() => {
    const flush = () => {
      const value = bufferRef.current.trim();
      bufferRef.current = "";

      if (!value) return;

      console.log("QR DETECTED:", value);

      const isValid = validate ? validate(value) : defaultValidate(value);
      if (!isValid) return;

      onScan?.(value);

      // if (!noRedirect) {
      //   if (openInNewTab) {
      //     window.open(value, "_blank", "noopener,noreferrer");
      //   } else {
      //     window.location.href = value;
      //   }
      // }
    };

    const handler = (e: KeyboardEvent) => {
      // Bỏ qua nếu người dùng đang focus vào input/textarea
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      // Bỏ qua modifier keys
      if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key))
        return;

      const now = Date.now();

      // Reset buffer nếu gõ quá chậm (không phải scanner)
      if (now - lastTimeRef.current > 200) {
        bufferRef.current = "";
      }

      lastTimeRef.current = now;

      // Nếu scanner gửi Enter → flush ngay
      if (e.key === "Enter") {
        if (timerRef.current) clearTimeout(timerRef.current);
        flush();
        return;
      }

      // Chỉ nhận ký tự thường
      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }

      // Đặt lại timer — flush sau endTimeout ms không có ký tự mới
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, endTimeout);
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [validate, onScan, openInNewTab, endTimeout, noRedirect]);

  return null;
}
