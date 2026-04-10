import { useEffect, useRef, useState } from "react";

export interface UseImageZoomOptions {
  scale?: number;
  disabled?: boolean;
  onTouchZoomChange?: (visible: boolean) => void;
}

export interface UseImageZoomReturn {
  containerRef: React.RefCallback<HTMLElement>;
  imgRef: React.RefCallback<HTMLImageElement>;
  touchZoomVisible: boolean;
  mouseHandlers: {
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
  };
  resetZoom: () => void;
}

const DOUBLE_TAP_DELAY = 300;

export function useImageZoom({
  scale = 3,
  disabled = false,
  onTouchZoomChange,
}: UseImageZoomOptions = {}): UseImageZoomReturn {
  const containerEl = useRef<HTMLElement | null>(null);
  const imgEl = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const zoomActive = useRef(false);
  const origin = useRef({ ox: 50, oy: 50 });

  // touch-specific
  const touchZoomActive = useRef(false);
  const lastTapTime = useRef(0);

  const [touchZoomVisible, setTouchZoomVisible] = useState(false);

  const computeOrigin = (clientX: number, clientY: number, rect: DOMRect) => ({
    ox: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
    oy: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
  });

  const applyZoom = (active: boolean) => {
    const img = imgEl.current;
    if (!img) return;
    if (active) {
      img.style.transform = `scale(${scale})`;
      img.style.transformOrigin = `${origin.current.ox}% ${origin.current.oy}%`;
    } else {
      img.style.transform = "scale(1)";
      img.style.transformOrigin = "center center";
    }
  };

  const scheduleApply = (active: boolean) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      applyZoom(active);
      rafRef.current = null;
    });
  };

  const resetZoom = () => {
    zoomActive.current = false;
    touchZoomActive.current = false;
    origin.current = { ox: 50, oy: 50 };
    applyZoom(false);
    setTouchZoomVisible(false);
    onTouchZoomChange?.(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const containerRef: React.RefCallback<HTMLElement> = (el) => {
    containerEl.current = el;
  };

  const imgRef: React.RefCallback<HTMLImageElement> = (el) => {
    imgEl.current = el;
  };

  const mouseHandlers = {
    onMouseEnter: (e: React.MouseEvent) => {
      if (disabled) return;
      const rect = containerEl.current?.getBoundingClientRect();
      if (!rect) return;
      origin.current = computeOrigin(e.clientX, e.clientY, rect);
      zoomActive.current = true;
      scheduleApply(true);
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (disabled || !zoomActive.current) return;
      const rect = containerEl.current?.getBoundingClientRect();
      if (!rect) return;
      origin.current = computeOrigin(e.clientX, e.clientY, rect);
      scheduleApply(true);
    },
    onMouseLeave: () => {
      if (disabled) return;
      zoomActive.current = false;
      scheduleApply(false);
    },
  };

  useEffect(() => {
    const el = containerEl.current;
    if (!el || disabled) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const now = Date.now();
      const isDoubleTap = now - lastTapTime.current < DOUBLE_TAP_DELAY;
      lastTapTime.current = now;

      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      const { ox, oy } = computeOrigin(touch.clientX, touch.clientY, rect);

      if (touchZoomActive.current) {
        if (isDoubleTap) {
          touchZoomActive.current = false;
          setTouchZoomVisible(false);
          onTouchZoomChange?.(false);
          origin.current = { ox: 50, oy: 50 };
          applyZoom(false);
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        } else {
          origin.current = { ox, oy };
          applyZoom(true);
        }
      } else {
        touchZoomActive.current = true;
        setTouchZoomVisible(true);
        onTouchZoomChange?.(true);
        origin.current = { ox, oy };
        applyZoom(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchZoomActive.current || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      origin.current = computeOrigin(touch.clientX, touch.clientY, rect);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        applyZoom(true);
        rafRef.current = null;
      });
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [disabled]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return { containerRef, imgRef, touchZoomVisible, mouseHandlers, resetZoom };
}
