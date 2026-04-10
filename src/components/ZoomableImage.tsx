import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useImageZoom } from "../hooks/useImageZoom";

interface ZoomableImageProps {
  src?: string | null;
  zoomEnabled?: boolean;
  scale?: number;
  isMobile?: boolean;
  containerStyle?: CSSProperties;
  imgStyle?: CSSProperties;
  fallback?: ReactNode;
  children?: ReactNode;
  alt?: string;
  onZoomRef?: (reset: () => void) => void;
  isOpen?: boolean;
}

/**
 * A container that wraps a single image with hover-zoom (desktop) and
 * tap-to-zoom (mobile) behaviour powered by `useImageZoom`.
 *
 * Example – inside MaterialDetail:
 * ```tsx
 * <ZoomableImage
 *   src={resolveImageSrc(images[selectedIndex])}
 *   isMobile={isMobile}
 *   zoomEnabled={!!images[selectedIndex]}
 *   containerStyle={{ width: "100%", height: isMobile ? 260 : 400 }}
 *   fallback={<span style={{ color: "#fff" }}>No Image</span>}
 *   onZoomRef={(reset) => (resetZoomRef.current = reset)}
 * />
 * ```
 *
 * Example – inside ImagePreviewModal (per-slot):
 * ```tsx
 * <ZoomableImage
 *   src={resolveImageSrc(slot)}
 *   isMobile={isMobile}
 *   zoomEnabled={!!slot && enableHoverPreview}
 *   containerStyle={{ width: slotWidth, height: imageSize }}
 *   fallback={<img src={emptyImage} />}
 * />
 * ```
 */
export default function ZoomableImage({
  src,
  zoomEnabled = true,
  scale = 3,
  isMobile = false,
  containerStyle,
  imgStyle,
  fallback,
  children,
  alt = "",
  onZoomRef,
  // isOpen,
}: ZoomableImageProps) {
  const { containerRef, imgRef, touchZoomVisible, mouseHandlers, resetZoom } =
    useImageZoom({ scale, disabled: !zoomEnabled });

  useEffect(() => {
    resetZoom();
  }, [src]);

  // useEffect(() => {
  //   if (isOpen) {
  //     resetZoom();
  //   }
  // }, [isOpen]);

  useEffect(() => {
    if (onZoomRef) {
      onZoomRef(resetZoom);
    }
  }, [onZoomRef, resetZoom]);

  const cursor = !zoomEnabled ? "default" : isMobile ? "pointer" : "zoom-in";

  return (
    <div
      ref={containerRef as React.RefCallback<HTMLDivElement>}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor,
        ...containerStyle,
      }}
      {...(!isMobile ? mouseHandlers : {})}
    >
      {src ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
            userSelect: "none",
            transition: "transform 0.08s ease-out",
            transformOrigin: "center center",
            imageRendering: "auto",
            ...imgStyle,
          }}
        />
      ) : (
        fallback
      )}

      {children}

      {isMobile && src && zoomEnabled && !touchZoomVisible && (
        <_Badge color="rgba(0,0,0,0.45)">Tap to zoom</_Badge>
      )}
      {isMobile && src && zoomEnabled && touchZoomVisible && (
        <_Badge color="rgba(22,119,255,0.75)">Double-tap to exit</_Badge>
      )}
    </div>
  );
}

function _Badge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 6,
        right: 6,
        background: color,
        color: "#fff",
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 10,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {children}
    </div>
  );
}
