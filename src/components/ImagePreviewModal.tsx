import { Grid, Modal } from "antd";
import { useMemo, useState } from "react";
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
  previewSize = 320,
  slotImageWidth,
}: ImagePreviewModalProps) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const allowHoverPreview = enableHoverPreview && !isMobile;

  const responsiveColumns = isMobile ? 2 : columns;
  const responsiveImageSize = isMobile ? 120 : imageSize;
  const slotWidth = slotImageWidth
    ? responsiveImageSize * slotImageWidth
    : responsiveImageSize;
  const gap = responsiveImageSize * 0.12;

  const [hoverSrc, setHoverSrc] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

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
    : // : responsiveColumns * responsiveImageSize +
      responsiveColumns * slotWidth + (responsiveColumns - 1) * gap + 48;

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
        title={`Preview Images (${validCount}/${maxImages})`}
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
              // gridTemplateColumns: `repeat(${responsiveColumns}, ${responsiveImageSize}px)`,
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
                  key={index}
                  style={{
                    // width: responsiveImageSize,
                    width: slotWidth,
                    height: responsiveImageSize,
                    // borderRadius: imageSize * 0.06,
                    border: "1px solid #ddd",
                    background: "#fafafa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
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
