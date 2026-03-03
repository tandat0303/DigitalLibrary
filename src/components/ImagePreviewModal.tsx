import { Modal } from "antd";
import { useMemo, useState } from "react";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  images?: (string | null)[];
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
  const gap = imageSize * 0.12;

  const [hoverSrc, setHoverSrc] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const validImages = useMemo(() => {
    return images.filter(Boolean) as string[];
  }, [images]);

  const slots = useMemo(() => {
    return Array.from({ length: maxImages }).map((_, index) => {
      return validImages[index] || null;
    });
  }, [validImages, maxImages]);

  const modalWidth = columns * imageSize + (columns - 1) * gap + 48;

  const handleMouseEnter = (e: React.MouseEvent, src: string | null) => {
    if (!enableHoverPreview || !src) return;

    setHoverSrc(src);
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
              gridTemplateColumns: `repeat(${columns}, ${imageSize}px)`,
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
                    width: imageSize,
                    height: imageSize,
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
                      src={src}
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
                          width: imageSize * 0.45,
                          height: imageSize * 0.45,
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

      {enableHoverPreview && hoverSrc && (
        <div
          style={{
            position: "fixed",
            top: hoverPos.y,
            left: hoverPos.x,
            width: previewSize,
            height: previewSize,
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
