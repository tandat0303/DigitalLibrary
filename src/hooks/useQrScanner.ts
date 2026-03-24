/*
 * @example — extract UUID từ /materials/<UUID>
 * const scanner = useQrScanner({
 *   pattern: /\/materials\/([0-9a-f-]{36})$/i,
 *   onMatch: (uuid) => console.log("material UUID:", uuid),
 * });
 */

import { useEffect, useRef } from "react";

interface UseQrScannerOptions {
  pattern: RegExp;
  validate?: (raw: string) => boolean;
  onMatch: (value: string) => void;
}

export function useQrScanner({
  pattern,
  validate,
  onMatch,
}: UseQrScannerOptions) {
  const onMatchRef = useRef(onMatch);

  useEffect(() => {
    onMatchRef.current = onMatch;
  }, [onMatch]);

  const handleValidate = (raw: string): boolean => {
    if (validate && !validate(raw)) return false;
    return pattern.test(raw);
  };

  const onScan = (raw: string): void => {
    const match = raw.match(pattern);
    if (match?.[1]) {
      onMatchRef.current(match[1]);
    } else {
      console.error("useQrScanner: không tìm thấy match trong:", raw);
    }
  };

  return { validate: handleValidate, onScan };
}
