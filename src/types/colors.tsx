import type { ColumnsType } from "antd/es/table";
import type { Image } from "./images";
import { normalizeRGB, resolveImageSrc } from "../lib/helpers";

export interface ColorsResponse {
  data: ColorsDataType[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ColorsDataType {
  ColorID: string;
  // ID_Img: string;
  // Thumbnail: string;
  ColorName: string;
  ColorCode: string;
  RGBValue: string;
  CMYKValue: string;
  ColorGroup: string;
  ColorStatus: boolean;
  // UserID: string;
  // UserDate: string;
  Images?: (Image | File)[];
}

interface ColorFormValues {
  ColorID: string;
  // ID_Img: string;
  // Thumbnail: string;
  ColorName: string;
  ColorCode: string;
  RGBValue: string;
  CMYKValue: string;
  ColorGroup: string;
  ColorStatus?: boolean;
  // UserID: string;
  // UserDate: string;
  Images?: (Image | File)[];
}

export interface ColorsModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<ColorFormValues> | null;
  onCancel: () => void;
  onSubmit: (values: ColorFormValues) => Promise<void>;
}

export const getColorsColumns = (
  onPreview: (images: (Image | File)[]) => void,
): ColumnsType<ColorsDataType> => [
  {
    title: "Thumbnail",
    dataIndex: "RGBValue",
    key: "RGBValue",
    render: () => null,
    onCell: (record: any) => {
      const rgb = normalizeRGB(record.RGBValue);
      return {
        style: {
          backgroundColor: rgb ? `rgb(${rgb})` : undefined,
        },
      };
    },
  },
  {
    title: "Color Name",
    dataIndex: "ColorName",
    // sorter: true,
  },
  {
    title: "Color Code",
    dataIndex: "ColorCode",
  },
  {
    title: "RGB Value",
    dataIndex: "RGBValue",
  },
  {
    title: "CMYK Value",
    dataIndex: "CMYKValue",
  },
  {
    title: "Reference",
    dataIndex: "Images",
    align: "center",
    onCell: () => ({
      style: {
        textAlign: "center",
        verticalAlign: "middle",
        padding: "4px",
      },
      // onClick: (e) => e.stopPropagation(),
    }),
    render: (images?: (Image | File)[]) => {
      const validImages = Array.isArray(images) ? images : [];

      if (!validImages.length) return null;
      const columns = Math.min(3, validImages.length);

      return (
        <div className="flex justify-center">
          <div
            className="grid gap-2 w-fit cursor-pointer"
            style={{
              gridTemplateColumns: `repeat(${columns}, 64px)`,
            }}
            onClick={(e) => {
              onPreview(validImages);
              e.stopPropagation();
            }}
          >
            {validImages.map((img, index) => {
              const src = resolveImageSrc(img);

              return (
                <img
                  key={index}
                  src={src}
                  className="w-16 h-12 object-cover rounded cursor-zoom-in hover:scale-110 hover:shadow-md transition-all duration-200 border border-[#8f8f8f]"
                  onLoad={() => {
                    if (img instanceof File) {
                      URL.revokeObjectURL(src);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      );
    },
  },
  {
    title: "Color Group",
    dataIndex: "ColorGroup",
  },
  {
    title: "Color Status",
    dataIndex: "ColorStatus",
    render: (status: boolean) => (status ? "Active" : "Disabled"),
  },
];
