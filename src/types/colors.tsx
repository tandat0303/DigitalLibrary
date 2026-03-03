import type { ColumnsType } from "antd/es/table";

export interface ColorsResponse {
  draw: string;
  recordsTotal: number;
  recordsFiltered: number;
  data: ColorsDataType[];
}

export interface ColorsDataType {
  ID: string;
  ID_Img: string;
  Thumbnail: string;
  Color_Name: string;
  Color_Code: string;
  RGB_Value: string;
  CMYK_Value: string;
  Color_Group: string;
  Color_Status: string;
  UserID: string;
  UserDate: string;
  ColorsImg?: string[];
}

interface ColorFormValues {
  ID: string;
  Color_Name: string;
  Color_Code: string;
  RGB_Value: string;
  CMYK_Value: string;
  Color_Group: string;
  Color_Status: string;
  ColorsImg?: string[];
}

export interface ColorsModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<ColorFormValues> | null;
  onCancel: () => void;
  onSubmit: (values: ColorFormValues) => Promise<void>;
}

export const getColorsColumns = (
  onPreview: (images: string[]) => void,
): ColumnsType<ColorsDataType> => [
  {
    title: "Thumbnail",
    dataIndex: "Thumbnail",
    key: "Thumbnail",
    render: () => null,
    onCell: (record: any) => {
      const rgb = record.Thumbnail?.trim();
      return {
        style: {
          backgroundColor: rgb ? `rgb(${rgb})` : undefined,
        },
      };
    },
  },
  {
    title: "Color Name",
    dataIndex: "Color_Name",
  },
  {
    title: "Color Code",
    dataIndex: "Color_Code",
  },
  {
    title: "RGB Value",
    dataIndex: "RGB_Value",
  },
  {
    title: "CMYK Value",
    dataIndex: "CMYK_Value",
  },
  {
    title: "Reference",
    dataIndex: "ColorsImg",
    align: "center",
    onCell: () => ({
      style: {
        textAlign: "center",
        verticalAlign: "middle",
        padding: "4px",
      },
      onClick: (e) => e.stopPropagation(),
    }),
    render: (images?: string[]) => {
      const validImages = Array.isArray(images) ? images.filter(Boolean) : [];

      if (!validImages.length) return null;

      const columns = Math.min(3, validImages.length);

      return (
        <div className="flex justify-center">
          <div
            className="grid grid-cols-3 gap-4 w-fit cursor-pointer"
            style={{
              gridTemplateColumns: `repeat(${columns}, 48px)`,
            }}
            onClick={() => onPreview(validImages)}
          >
            {validImages.map((src, index) => (
              <img
                key={index}
                src={src}
                className="w-16 h-12 object-cover rounded cursor-zoom-in hover:scale-110 hover:shadow-md transition-all duration-200 border border-[#8f8f8f]"
              />
            ))}
          </div>
        </div>
      );
    },
  },
  {
    title: "Color Group",
    dataIndex: "Color_Group",
  },
  {
    title: "Color Status",
    dataIndex: "Color_Status",
  },
];
