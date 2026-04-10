// import { Grid, Modal } from "antd";
// import { useEffect, useMemo, useRef, useState } from "react";
// import type { Image } from "../types/images";
// import { mapImagesToLabels, resolveImageSrc } from "../lib/helpers";

// interface ImagePreviewModalProps {
//   open: boolean;
//   onClose: () => void;
//   images?: (File | Image | null)[];
//   columns?: number;
//   maxImages?: number;
//   imageSize?: number;
//   emptyImage?: string;
//   labels?: string[];
//   enableHoverPreview?: boolean;
//   previewSize?: number;
//   slotImageWidth?: number;
// }

// const ZOOM_SCALE = 3;

// export default function ImagePreviewModal({
//   open,
//   onClose,
//   images = [],
//   columns = 3,
//   maxImages = 3,
//   imageSize = 150,
//   emptyImage = "/no-image.png",
//   labels = [],
//   enableHoverPreview = true,
//   slotImageWidth,
// }: ImagePreviewModalProps) {
//   const { useBreakpoint } = Grid;
//   const screens = useBreakpoint();
//   const isMobile = !screens.md;

//   const [isTouch, setIsTouch] = useState(
//     () =>
//       typeof window !== "undefined" &&
//       ("ontouchstart" in window || navigator.maxTouchPoints > 0),
//   );
//   useEffect(() => {
//     const onFirstTouch = () => {
//       setIsTouch(true);
//       window.removeEventListener("touchstart", onFirstTouch);
//     };
//     window.addEventListener("touchstart", onFirstTouch, { passive: true });
//     return () => window.removeEventListener("touchstart", onFirstTouch);
//   }, []);

//   const responsiveColumns = isMobile ? 2 : columns;
//   const responsiveImageSize = isMobile ? 120 : imageSize;
//   const slotWidth = slotImageWidth
//     ? responsiveImageSize * slotImageWidth
//     : responsiveImageSize;
//   const gap = responsiveImageSize * 0.12;

//   const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
//   const rafRef = useRef<number | null>(null);

//   const zoomState = useRef<{ active: boolean; ox: number; oy: number }[]>([]);

//   const touchZoomSlot = useRef<number | null>(null);
//   const [touchZoomVisible, setTouchZoomVisible] = useState(false);
//   const lastTapTime = useRef(0);
//   const lastTapSlot = useRef<number | null>(null);
//   const DOUBLE_TAP_DELAY = 300;

//   const slots = useMemo(() => {
//     if (labels.length) {
//       return mapImagesToLabels(images, labels, maxImages);
//     }
//     return Array.from({ length: maxImages }).map(
//       (_, index) => images[index] || null,
//     );
//   }, [images, labels, maxImages]);

//   useEffect(() => {
//     zoomState.current = slots.map(() => ({ active: false, ox: 50, oy: 50 }));
//   }, [slots]);

//   const validCount = slots.filter(Boolean).length;

//   const modalWidth = isMobile
//     ? "95vw"
//     : responsiveColumns * slotWidth + (responsiveColumns - 1) * gap + 48;

//   const applyZoom = (index: number) => {
//     const img = imgRefs.current[index];
//     const state = zoomState.current[index];
//     if (!img || !state) return;
//     if (state.active) {
//       img.style.transform = `scale(${ZOOM_SCALE})`;
//       img.style.transformOrigin = `${state.ox}% ${state.oy}%`;
//     } else {
//       img.style.transform = "scale(1)";
//       img.style.transformOrigin = "center center";
//     }
//   };

//   // Compute origin % from clientX/Y inside the slot rect
//   const computeOrigin = (clientX: number, clientY: number, rect: DOMRect) => {
//     const ox = Math.max(
//       0,
//       Math.min(100, ((clientX - rect.left) / rect.width) * 100),
//     );
//     const oy = Math.max(
//       0,
//       Math.min(100, ((clientY - rect.top) / rect.height) * 100),
//     );
//     return { ox, oy };
//   };

//   const scheduleUpdate = (index: number) => {
//     if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     rafRef.current = requestAnimationFrame(() => {
//       applyZoom(index);
//       rafRef.current = null;
//     });
//   };

//   const handleMouseEnter = (
//     e: React.MouseEvent,
//     index: number,
//     src: File | Image | null,
//   ) => {
//     if (isTouch || !enableHoverPreview || !src) return;
//     const slot = slotRefs.current[index];
//     if (!slot) return;
//     const rect = slot.getBoundingClientRect();
//     const { ox, oy } = computeOrigin(e.clientX, e.clientY, rect);
//     zoomState.current[index] = { active: true, ox, oy };
//     scheduleUpdate(index);
//   };

//   const handleMouseMove = (e: React.MouseEvent, index: number) => {
//     if (isTouch || !zoomState.current[index]?.active) return;
//     const slot = slotRefs.current[index];
//     if (!slot) return;
//     const rect = slot.getBoundingClientRect();
//     const { ox, oy } = computeOrigin(e.clientX, e.clientY, rect);
//     zoomState.current[index].ox = ox;
//     zoomState.current[index].oy = oy;
//     scheduleUpdate(index);
//   };

//   const handleMouseLeave = (index: number) => {
//     if (isTouch) return;
//     zoomState.current[index] = { active: false, ox: 50, oy: 50 };
//     scheduleUpdate(index);
//   };

//   useEffect(() => {
//     if (!open) {
//       zoomState.current.forEach((s, i) => {
//         if (s) s.active = false;
//         applyZoom(i);
//       });
//       touchZoomSlot.current = null;
//       setTouchZoomVisible(false);
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     }
//   }, [open]);

//   useEffect(() => {
//     if (!isTouch || !enableHoverPreview) return;

//     const cleanups: (() => void)[] = [];

//     slots.forEach((src, index) => {
//       const el = slotRefs.current[index];
//       if (!el || !src) return;

//       const onTouchStart = (e: TouchEvent) => {
//         if (e.touches.length !== 1) return;
//         const now = Date.now();
//         const isSameSlot = lastTapSlot.current === index;
//         const isDoubleTap =
//           isSameSlot && now - lastTapTime.current < DOUBLE_TAP_DELAY;
//         lastTapTime.current = now;
//         lastTapSlot.current = index;

//         const isCurrentlyZoomed =
//           touchZoomSlot.current === index && zoomState.current[index]?.active;

//         if (isCurrentlyZoomed) {
//           if (isDoubleTap) {
//             // Double tap to exit zoom
//             zoomState.current[index] = { active: false, ox: 50, oy: 50 };
//             applyZoom(index);
//             touchZoomSlot.current = null;
//             setTouchZoomVisible(false);
//           } else {
//             // Move zoom origin to new touch position
//             const touch = e.touches[0];
//             const rect = el.getBoundingClientRect();
//             const { ox, oy } = computeOrigin(
//               touch.clientX,
//               touch.clientY,
//               rect,
//             );
//             zoomState.current[index] = { active: true, ox, oy };
//             applyZoom(index);
//           }
//         } else {
//           // Deactivate previous slot's zoom if switching
//           if (
//             touchZoomSlot.current !== null &&
//             touchZoomSlot.current !== index
//           ) {
//             const prev = touchZoomSlot.current;
//             zoomState.current[prev] = { active: false, ox: 50, oy: 50 };
//             applyZoom(prev);
//           }
//           // Activate zoom on this slot
//           const touch = e.touches[0];
//           const rect = el.getBoundingClientRect();
//           const { ox, oy } = computeOrigin(touch.clientX, touch.clientY, rect);
//           zoomState.current[index] = { active: true, ox, oy };
//           applyZoom(index);
//           touchZoomSlot.current = index;
//           setTouchZoomVisible(true);
//         }
//       };

//       const onTouchMove = (e: TouchEvent) => {
//         if (
//           !zoomState.current[index]?.active ||
//           touchZoomSlot.current !== index ||
//           e.touches.length !== 1
//         )
//           return;
//         e.preventDefault();
//         const touch = e.touches[0];
//         const rect = el.getBoundingClientRect();
//         const { ox, oy } = computeOrigin(touch.clientX, touch.clientY, rect);
//         zoomState.current[index].ox = ox;
//         zoomState.current[index].oy = oy;
//         if (rafRef.current) cancelAnimationFrame(rafRef.current);
//         rafRef.current = requestAnimationFrame(() => {
//           applyZoom(index);
//           rafRef.current = null;
//         });
//       };

//       el.addEventListener("touchstart", onTouchStart, { passive: false });
//       el.addEventListener("touchmove", onTouchMove, { passive: false });

//       cleanups.push(() => {
//         el.removeEventListener("touchstart", onTouchStart);
//         el.removeEventListener("touchmove", onTouchMove);
//       });
//     });

//     return () => {
//       cleanups.forEach((fn) => fn());
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, [slots, isTouch, enableHoverPreview]);

//   useEffect(() => {
//     return () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, []);

//   return (
//     <Modal
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       centered
//       width={modalWidth}
//       title={`Preview Images (${validCount}/${maxImages})`}
//     >
//       <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: `repeat(${responsiveColumns}, ${slotWidth}px)`,
//             gap,
//             justifyContent: "center",
//           }}
//         >
//           {slots.map((src, index) => (
//             <div key={index} className="flex flex-col shrink-0">
//               {labels?.[index] && (
//                 <span className="mb-1 text-sm font-bold text-gray-600">
//                   {labels[index]}
//                 </span>
//               )}
//               <div
//                 ref={(el) => {
//                   slotRefs.current[index] = el;
//                 }}
//                 style={{
//                   width: slotWidth,
//                   height: responsiveImageSize,
//                   border: "1px solid #ddd",
//                   background: "#fafafa",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   overflow: "hidden",
//                   position: "relative",
//                   cursor:
//                     src && enableHoverPreview
//                       ? isTouch
//                         ? "pointer"
//                         : "zoom-in"
//                       : "default",
//                 }}
//                 onMouseEnter={(e) => handleMouseEnter(e, index, src)}
//                 onMouseMove={(e) => handleMouseMove(e, index)}
//                 onMouseLeave={() => handleMouseLeave(index)}
//               >
//                 {src ? (
//                   <img
//                     ref={(el) => {
//                       imgRefs.current[index] = el;
//                     }}
//                     src={resolveImageSrc(src)}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "contain",
//                       objectPosition: "center",
//                       display: "block",
//                       transition: "transform 0.08s ease-out",
//                       transformOrigin: "center center",
//                       imageRendering: "auto",
//                     }}
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center justify-center">
//                     <img
//                       src={emptyImage}
//                       style={{
//                         width: responsiveImageSize * 0.45,
//                         height: responsiveImageSize * 0.45,
//                         objectFit: "contain",
//                       }}
//                     />
//                     <span>No Image</span>
//                   </div>
//                 )}

//                 {/* Mobile hint: tap to zoom */}
//                 {isTouch && src && enableHoverPreview && !touchZoomVisible && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       bottom: 4,
//                       right: 4,
//                       background: "rgba(0,0,0,0.45)",
//                       color: "#fff",
//                       fontSize: 10,
//                       padding: "2px 6px",
//                       borderRadius: 10,
//                       pointerEvents: "none",
//                       userSelect: "none",
//                     }}
//                   >
//                     Tap
//                   </div>
//                 )}
//                 {isTouch &&
//                   src &&
//                   enableHoverPreview &&
//                   touchZoomSlot.current === index &&
//                   touchZoomVisible && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         bottom: 4,
//                         right: 4,
//                         background: "rgba(22,119,255,0.75)",
//                         color: "#fff",
//                         fontSize: 10,
//                         padding: "2px 6px",
//                         borderRadius: 10,
//                         pointerEvents: "none",
//                         userSelect: "none",
//                       }}
//                     >
//                       ×2 tap exit
//                     </div>
//                   )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Modal>
//   );
// }

import { Grid, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { Image } from "../types/images";
import { mapImagesToLabels, resolveImageSrc } from "../lib/helpers";
import ZoomableImage from "./ZoomableImage";

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

              <ZoomableImage
                src={src ? resolveImageSrc(src) : null}
                zoomEnabled={!!src && enableHoverPreview}
                isMobile={isTouch}
                scale={3}
                containerStyle={{
                  width: slotWidth,
                  height: responsiveImageSize,
                  border: "1px solid #ddd",
                  background: "#fafafa",
                }}
                fallback={
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
                }
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
