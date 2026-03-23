import { useEffect, useRef } from "react";

interface QrScannerRedirectProps {
  validate?: (value: string) => boolean;
  onScan?: (value: string) => void;
  openInNewTab?: boolean;
}

export default function QrScannerRedirect({
  validate,
  onScan,
  openInNewTab = true,
}: QrScannerRedirectProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const defaultValidate = (value: string) => /^https?:\/\/.+/i.test(value);

  const handleEnter = (rawValue: string) => {
    const value = rawValue.replace(/[\r\n]/g, "").trim();
    console.log(rawValue);
    if (!value) return;

    const isValid = validate ? validate(value) : defaultValidate(value);

    if (!isValid) return;

    onScan?.(value);

    if (openInNewTab) {
      window.open(value, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = value;
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isTypingElement =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (!isTypingElement) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      tabIndex={-1}
      style={{
        position: "fixed",
        opacity: 0,
        width: 1,
        height: 1,
        pointerEvents: "none",
      }}
      onKeyDown={(e) => {
        if (document.activeElement !== inputRef.current) {
          return;
        }

        if (e.key === "Enter") {
          const el = e.target as HTMLInputElement;
          handleEnter(el.value);
          el.value = "";
        }
      }}
    />
  );
}
