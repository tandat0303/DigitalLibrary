import { Grid, Modal } from "antd";
import { useMemo, useState } from "react";
import type { Image } from "../types/images";
import { resolveImageSrc } from "../lib/helpers";

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
  previewSize = 320,
}: ImagePreviewModalProps) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const allowHoverPreview = enableHoverPreview && !isMobile;

  const responsiveColumns = isMobile ? 2 : columns;
  const responsiveImageSize = isMobile ? 120 : imageSize;
  const gap = responsiveImageSize * 0.12;

  const [hoverSrc, setHoverSrc] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const validImages = useMemo(() => {
    return images.filter(Boolean) as (File | Image)[];
  }, [images]);

  const slots = useMemo(() => {
    return Array.from({ length: maxImages }).map((_, index) => {
      return validImages[index] || null;
    });
  }, [validImages, maxImages]);

  const modalWidth = isMobile
    ? "95vw"
    : responsiveColumns * responsiveImageSize +
      (responsiveColumns - 1) * gap +
      48;

  const handleMouseEnter = (e: React.MouseEvent, file: File | Image) => {
    if (!allowHoverPreview || !file) return;

    const url = resolveImageSrc(file);

    setHoverSrc(url);
    setHoverPos({
      x: e.clientX + 20,
      y: e.clientY - previewSize / 2,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hoverSrc) return;

    setHoverPos({
      x: e.clientX + 20,
      y: e.clientY - previewSize / 2,
    });
  };

  const handleMouseLeave = () => {
    setHoverSrc(null);
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        width={modalWidth}
        title={`Preview Images (${validImages.length}/${maxImages})`}
      >
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            paddingTop: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${responsiveColumns}, ${responsiveImageSize}px)`,
              gap,
              justifyContent: "center",
            }}
          >
            {slots.map((src, index) => (
              <div key={index} className="flex flex-col shrink-0">
                {labels?.[index] && (
                  <span className="mb-1 text-sm font-medium text-gray-600">
                    {labels[index]}
                  </span>
                )}
                <div
                  key={index}
                  style={{
                    width: responsiveImageSize,
                    height: responsiveImageSize,
                    // borderRadius: imageSize * 0.06,
                    border: "1px solid #ddd",
                    background: "#fafafa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: src ? "zoom-in" : "default",
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, src)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {src ? (
                    <img
                      src={resolveImageSrc(src)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {allowHoverPreview && hoverSrc && (
        <div
          style={{
            position: "fixed",
            top: hoverPos.y,
            left: hoverPos.x,
            width: previewSize,
            height: previewSize,
            overflow: "hidden",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            padding: 8,
            zIndex: 2000,
            pointerEvents: "none",
          }}
        >
          <img
            src={hoverSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </>
  );
}
