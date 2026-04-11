/*
 * @example — extract UUID từ /materials/<UUID>
 * const scanner = useQrScanner({
 *   pattern: /\/materials\/([0-9a-f-]{36})$/i,
 *   onMatch: (uuid) => console.log("material UUID:", uuid),
 * });
 */

import { useEffect, useRef } from "react";

interface ScanResult {
  raw: string;
  match?: string;
}

interface UseQrScannerOptions {
  pattern?: RegExp;
  validate?: (raw: string) => boolean;
  onScanResult: (result: ScanResult) => void;
}

export function useQrScanner({
  pattern,
  validate,
  onScanResult,
}: UseQrScannerOptions) {
  const onScanRef = useRef(onScanResult);

  useEffect(() => {
    onScanRef.current = onScanResult;
  }, [onScanResult]);

  const handleValidate = (raw: string): boolean => {
    if (validate && !validate(raw)) return false;
    return true;
  };

  const onScan = (raw: string): void => {
    let matchValue: string | undefined;

    if (pattern) {
      const match = raw.match(pattern);
      matchValue = match?.[1];
    }

    onScanRef.current({
      raw,
      match: matchValue,
    });
  };

  return { validate: handleValidate, onScan };
}
