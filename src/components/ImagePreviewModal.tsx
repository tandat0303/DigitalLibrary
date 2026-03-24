import { Grid, Modal } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Image } from "../types/images";
import { mapImagesToLabels, resolveImageSrc } from "../lib/helpers";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  images?: (File | Image | null)[];
  columns?: number;
  maxImages?: number;
  imageSize?: number;
  emptyImage?: string;
  labels?: string[];
  enableHoverPreview?: boolean;
  previewSize?: number;
  slotImageWidth?: number;
}

export default function ImagePreviewModal({
  open,
  onClose,
  images = [],
  columns = 3,
  maxImages = 3,
  imageSize = 150,
  emptyImage = "/no-image.png",
  labels = [],
  enableHoverPreview = true,
  // previewSize: _previewSize,
  slotImageWidth,
}: ImagePreviewModalProps) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [isTouch, setIsTouch] = useState(
    () =>
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0),
  );
  useEffect(() => {
    const onFirstTouch = () => {
      setIsTouch(true);
      window.removeEventListener("touchstart", onFirstTouch);
    };
    window.addEventListener("touchstart", onFirstTouch, { passive: true });
    return () => window.removeEventListener("touchstart", onFirstTouch);
  }, []);

  const responsiveColumns = isMobile ? 2 : columns;
  const responsiveImageSize = isMobile ? 120 : imageSize;
  const slotWidth = slotImageWidth
    ? responsiveImageSize * slotImageWidth
    : responsiveImageSize;
  const gap = responsiveImageSize * 0.12;

  const LENS_SIZE = 120;
  const ZOOM_SCALE = 1;

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lensRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const zoomData = useRef({ x: 0, y: 0 });

  const activeSlot = useRef<number | null>(null);
  const lensReady = useRef<boolean[]>([]);

  const touchZoomActive = useRef(false);
  const [touchZoomVisible, setTouchZoomVisible] = useState(false);
  const touchZoomSlot = useRef<number | null>(null);
  const lastTapTime = useRef(0);
  const lastTapSlot = useRef<number | null>(null);
  const DOUBLE_TAP_DELAY = 300;

  const slots = useMemo(() => {
    if (labels.length) {
      return mapImagesToLabels(images, labels, maxImages);
    }
    return Array.from({ length: maxImages }).map(
      (_, index) => images[index] || null,
    );
  }, [images, labels, maxImages]);

  const validCount = slots.filter(Boolean).length;

  const modalWidth = isMobile
    ? "95vw"
    : responsiveColumns * slotWidth + (responsiveColumns - 1) * gap + 48;

  useEffect(() => {
    lensReady.current = slots.map(() => false);

    slots.forEach((src, i) => {
      if (!src) return;
      const url = resolveImageSrc(src);
      const img = new window.Image();
      img.onload = () => {
        if (lensRefs.current[i]) {
          lensRefs.current[i]!.style.backgroundImage = `url(${url})`;
        }
        lensReady.current[i] = true;
      };
      img.src = url;
    });
  }, [slots]);

  useEffect(() => {
    if (!open) {
      touchZoomActive.current = false;
      setTouchZoomVisible(false);
      touchZoomSlot.current = null;
      activeSlot.current = null;
      lensRefs.current.forEach((lens) => {
        if (lens) lens.style.opacity = "0";
      });
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  }, [open]);

  const applyLens = (index: number, x: number, y: number, rect: DOMRect) => {
    const lens = lensRefs.current[index];
    if (!lens) return;
    const bgW = rect.width * ZOOM_SCALE;
    const bgH = rect.height * ZOOM_SCALE;
    const bgX = (x / rect.width) * bgW;
    const bgY = (y / rect.height) * bgH;
    lens.style.left = `${x - LENS_SIZE / 2}px`;
    lens.style.top = `${y - LENS_SIZE / 2}px`;
    lens.style.backgroundSize = `${bgW}px ${bgH}px`;
    lens.style.backgroundPosition = `-${bgX - LENS_SIZE / 2}px -${bgY - LENS_SIZE / 2}px`;
  };

  const computeClampedPos = (
    clientX: number,
    clientY: number,
    rect: DOMRect,
  ) => {
    const half = LENS_SIZE / 2;
    const x = Math.max(half, Math.min(rect.width - half, clientX - rect.left));
    const y = Math.max(half, Math.min(rect.height - half, clientY - rect.top));
    return { x, y };
  };

  const scheduleUpdate = (index: number, x: number, y: number) => {
    zoomData.current = { x, y };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const slot = slotRefs.current[index];
      if (slot) {
        applyLens(
          index,
          zoomData.current.x,
          zoomData.current.y,
          slot.getBoundingClientRect(),
        );
      }
      rafRef.current = null;
    });
  };

  const handleMouseEnter = (
    e: React.MouseEvent,
    index: number,
    src: File | Image | null,
  ) => {
    if (isTouch || !enableHoverPreview || !src || !lensReady.current[index])
      return;
    const slot = slotRefs.current[index];
    const lens = lensRefs.current[index];
    if (!slot || !lens) return;
    activeSlot.current = index;
    lens.style.opacity = "1";
    const rect = slot.getBoundingClientRect();
    const { x, y } = computeClampedPos(e.clientX, e.clientY, rect);
    applyLens(index, x, y, rect);
  };

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (isTouch || activeSlot.current !== index) return;
    const slot = slotRefs.current[index];
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    const { x, y } = computeClampedPos(e.clientX, e.clientY, rect);
    scheduleUpdate(index, x, y);
  };

  const handleMouseLeave = (index: number) => {
    if (isTouch) return;
    const lens = lensRefs.current[index];
    if (lens) lens.style.opacity = "0";
    activeSlot.current = null;
  };

  useEffect(() => {
    if (!isTouch || !enableHoverPreview) return;

    const cleanups: (() => void)[] = [];

    slots.forEach((src, index) => {
      const el = slotRefs.current[index];
      if (!el || !src) return;

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        const now = Date.now();
        const isSameSlot = lastTapSlot.current === index;
        const isDoubleTap =
          isSameSlot && now - lastTapTime.current < DOUBLE_TAP_DELAY;
        lastTapTime.current = now;
        lastTapSlot.current = index;

        if (touchZoomActive.current && touchZoomSlot.current === index) {
          if (isDoubleTap) {
            touchZoomActive.current = false;
            setTouchZoomVisible(false);
            touchZoomSlot.current = null;
            const lens = lensRefs.current[index];
            if (lens) lens.style.opacity = "0";
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }
          } else {
            const touch = e.touches[0];
            const rect = el.getBoundingClientRect();
            const { x, y } = computeClampedPos(
              touch.clientX,
              touch.clientY,
              rect,
            );
            applyLens(index, x, y, rect);
            scheduleUpdate(index, x, y);
          }
        } else {
          if (
            touchZoomActive.current &&
            touchZoomSlot.current !== null &&
            touchZoomSlot.current !== index
          ) {
            const prevLens = lensRefs.current[touchZoomSlot.current];
            if (prevLens) prevLens.style.opacity = "0";
          }
          if (!lensReady.current[index]) return;
          touchZoomActive.current = true;
          setTouchZoomVisible(true);
          touchZoomSlot.current = index;
          const lens = lensRefs.current[index];
          if (lens) lens.style.opacity = "1";
          const touch = e.touches[0];
          const rect = el.getBoundingClientRect();
          const { x, y } = computeClampedPos(
            touch.clientX,
            touch.clientY,
            rect,
          );
          applyLens(index, x, y, rect);
          scheduleUpdate(index, x, y);
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (
          !touchZoomActive.current ||
          touchZoomSlot.current !== index ||
          e.touches.length !== 1
        )
          return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = el.getBoundingClientRect();
        const { x, y } = computeClampedPos(touch.clientX, touch.clientY, rect);
        scheduleUpdate(index, x, y);
      };

      el.addEventListener("touchstart", onTouchStart, { passive: false });
      el.addEventListener("touchmove", onTouchMove, { passive: false });

      cleanups.push(() => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [slots, isTouch, enableHoverPreview]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={modalWidth}
      title={`Preview Images (${validCount}/${maxImages})`}
    >
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${responsiveColumns}, ${slotWidth}px)`,
            gap,
            justifyContent: "center",
          }}
        >
          {slots.map((src, index) => (
            <div key={index} className="flex flex-col shrink-0">
              {labels?.[index] && (
                <span className="mb-1 text-sm font-bold text-gray-600">
                  {labels[index]}
                </span>
              )}
              <div
                ref={(el) => {
                  slotRefs.current[index] = el;
                }}
                style={{
                  width: slotWidth,
                  height: responsiveImageSize,
                  border: "1px solid #ddd",
                  background: "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                  cursor:
                    src && enableHoverPreview
                      ? isTouch
                        ? "pointer"
                        : "zoom-in"
                      : "default",
                }}
                onMouseEnter={(e) => handleMouseEnter(e, index, src)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                {src ? (
                  <img
                    src={resolveImageSrc(src)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={emptyImage}
                      style={{
                        width: responsiveImageSize * 0.45,
                        height: responsiveImageSize * 0.45,
                        objectFit: "contain",
                      }}
                    />
                    <span>No Image</span>
                  </div>
                )}

                {/* Zoom lens — always mounted per slot, shown/hidden via opacity */}
                <div
                  ref={(el) => {
                    lensRefs.current[index] = el;
                  }}
                  style={{
                    position: "absolute",
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    border: "2px solid white",
                    boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                    pointerEvents: "none",
                    opacity: 0,
                    transition: "opacity 0.15s",
                    backgroundRepeat: "no-repeat",
                    // backgroundImage, backgroundSize, backgroundPosition set via DOM
                  }}
                />

                {/* Mobile hints */}
                {isTouch && src && enableHoverPreview && !touchZoomVisible && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.45)",
                      color: "#fff",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 10,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    Tap
                  </div>
                )}
                {isTouch &&
                  src &&
                  enableHoverPreview &&
                  touchZoomSlot.current === index &&
                  touchZoomVisible && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        background: "rgba(22,119,255,0.75)",
                        color: "#fff",
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 10,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      ×2 tap exit
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
