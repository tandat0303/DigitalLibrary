import { Modal } from "antd";
import { useEffect, useState } from "react";
import { CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Images } from "lucide-react";
import { AppAlert } from "./ui/AppAlert";
import { toBase64 } from "../lib/helpers";

interface ImageUploaderProps {
  value?: (string | null)[];
  onChange?: (images: (string | null)[]) => void;
  max?: number;
  accept?: string[];
  width?: number;
  height?: number;
  labels?: string[];
}

export default function ImageUploader({
  value,
  onChange,
  max = 6,
  accept = ["image/jpeg", "image/png"],
  width = 180,
  height = 150,
  labels = [],
}: ImageUploaderProps) {
  const [images, setImages] = useState<(string | null)[]>(
    value || Array(max).fill(null),
  );

  useEffect(() => {
    if (value) {
      setImages(value);
    }
  }, [value]);

  const triggerChange = (newImages: (string | null)[]) => {
    setImages(newImages);
    onChange?.(newImages);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!accept.includes(file.type)) {
      AppAlert({
        icon: "error",
        title: `Only ${accept.join(", ")} allowed`,
      });
      return;
    }

    const base64 = await toBase64(file);

    const newImages = [...images];
    newImages[index] = base64;
    triggerChange(newImages);
  };

  const confirmRemoveImage = (index: number) => {
    Modal.confirm({
      title: "Remove Image",
      content: "Are you sure you want to remove this image?",
      okType: "danger",
      centered: true,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      onOk: () => {
        const newImages = [...images];
        newImages[index] = null;
        triggerChange(newImages);
      },
    });
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {images.map((src, index) => (
        <div key={index} className="flex flex-col shrink-0">
          {labels?.[index] && (
            <span className="mb-1 text-sm font-bold adidas-font text-gray-600">
              {labels[index]}
            </span>
          )}

          <div
            className="group relative border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition shrink-0"
            style={{ width, height }}
          >
            <input
              type="file"
              accept={accept.join(",")}
              onChange={(e) => handleFileChange(e, index)}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />

            {src ? (
              <>
                <img
                  src={src}
                  alt="preview"
                  className="w-full h-full object-cover rounded-md"
                />

                {/* opacity-0 group-hover:opacity-100 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmRemoveImage(index);
                  }}
                  className="
                    absolute top-2 right-2
                    w-7 h-7
                    flex items-center justify-center
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    rounded-md
                    transition
                    shadow-md
                    z-20
                  "
                >
                  <CloseOutlined style={{ fontSize: 12 }} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Images className="w-8 h-8" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
