import type { ColumnsType } from "antd/es/table";
import { Eye } from "lucide-react";
import type { Image } from "./images";
import {
  // normalizeColumns,
  resolveImageSrc,
  sortImagesByType,
} from "../lib/helpers";

export interface MaterialsResponse {
  data: MaterialsDataType[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MaterialsDataType {
  ID: string;
  // ID_Image: string;
  Unique_Price_ID: string;
  Material_ID: string;
  Vendor_Code: string;
  Supplier: string;
  Supplier_Material_ID: string;
  Supplier_Material_Name: string;
  Mtl_Supp_Lifecycle_State: string;
  Material_Type_Level_1: string;
  Composition: string;
  Classification: string;
  Material_Thickness: string;
  Material_Thickness_UOM: string;
  Comparison_UOM: string;
  Price_Remark: string;
  Skin_Size: string;
  QC_Percent: string;
  Leadtime: string;
  Sample_Leadtime: string;
  Min_Qty_Color: string;
  Min_Qty_Sample: string;
  Production_Location: string;
  Terms_of_Delivery_per_T1_Country: string;
  Valid_From_Price: string;
  Valid_To_Price: string;
  Price_Type: string;
  Color_Code_Price: string;
  Color_Price: string;
  Treatment_Price: string;
  Width_Price: string;
  Width_Uom_Price: string;
  Length_Price: string;
  Length_Uom_Price: string;
  Thickness_Price: string;
  Thickness_Uom_Price: string;
  Diameter_Inside_Price: string;
  Diameter_Inside_Uom_Price: string;
  Weight_Price: string;
  Weight_Uom_Price: string;
  Quantity_Price: string;
  Quantity_Uom_Price: string;
  Uom_String_Price: string;
  SS26_Final_Price_USD: string;
  Comparison_Price_Price_USD: string;
  Approved_As_Final_Price_Y_N_Price: string;
  // UserID: string;
  // UserDate: string;
  Season: string;
  // ID_MaterialImage: string;
  Images?: (Image | File)[];
  // User_Account: string;
  FileName: string;
  FilePath: string;
}

interface MaterialFormValues {
  ID: string;
  // ID_Image: string;
  Unique_Price_ID: string;
  Material_ID: string;
  Vendor_Code: string;
  Supplier: string;
  Supplier_Material_ID: string;
  Supplier_Material_Name: string;
  Mtl_Supp_Lifecycle_State: string;
  Material_Type_Level_1: string;
  Composition: string;
  Classification: string;
  Material_Thickness: string;
  Material_Thickness_UOM: string;
  Comparison_UOM: string;
  Price_Remark: string;
  Skin_Size: string;
  QC_Percent: string;
  Leadtime: string;
  Sample_Leadtime: string;
  Min_Qty_Color: string;
  Min_Qty_Sample: string;
  Production_Location: string;
  Terms_of_Delivery_per_T1_Country: string;
  Valid_From_Price: string;
  Valid_To_Price: string;
  Price_Type: string;
  Color_Code_Price: string;
  Color_Price: string;
  Treatment_Price: string;
  Width_Price: string;
  Width_Uom_Price: string;
  Length_Price: string;
  Length_Uom_Price: string;
  Thickness_Price: string;
  Thickness_Uom_Price: string;
  Diameter_Inside_Price: string;
  Diameter_Inside_Uom_Price: string;
  Weight_Price: string;
  Weight_Uom_Price: string;
  Quantity_Price: string;
  Quantity_Uom_Price: string;
  Uom_String_Price: string;
  SS26_Final_Price_USD: string;
  Comparison_Price_Price_USD: string;
  Approved_As_Final_Price_Y_N_Price: string;
  // UserID: string;
  // UserDate: string;
  Season: string;
  ID_MaterialImage: string;
  Images?: (Image | File)[];
  // User_Account: string;
  FileName: string;
  FilePath: string;
}

export interface MaterialsModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<MaterialFormValues> | null;
  onCancel: () => void;
  onSubmit: (values: MaterialFormValues) => Promise<void>;
}

export const getMaterialsColumns = (
  onPreview: (images: (Image | File)[]) => void,
  onView: (record: MaterialsDataType) => void,
): ColumnsType<MaterialsDataType> =>
  // {
  // const columns: ColumnsType<MaterialsDataType> =
  [
    {
      title: "Action",
      key: "action",
      width: 70,
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center h-full">
          <Eye
            className="cursor-pointer h-4"
            onClick={(e) => {
              e.stopPropagation();
              onView(record);
            }}
          />
        </div>
      ),
    },
    {
      title: "Image",
      dataIndex: "Images",
      align: "center",
      // onCell: () => ({
      //   onClick: (e) => e.stopPropagation(),
      // }),
      render: (images?: (Image | File)[]) => {
        const validImages = Array.isArray(images)
          ? sortImagesByType(images)
          : [];

        if (!validImages.length) return null;

        const columns = Math.min(2, validImages.length);

        return (
          <div className="flex justify-center">
            <div
              className="grid gap-2 w-fit cursor-pointer"
              style={{ gridTemplateColumns: `repeat(${columns}, 64px)` }}
              onClick={(e) => {
                const previewImages = validImages.filter(
                  (img): img is Image | File => img !== null,
                );

                onPreview(previewImages);
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
                    // onClick={(e) => e.stopPropagation()}
                    // onError={(e) => e.stopPropagation()}
                  />
                );
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: "Material ID",
      dataIndex: "Material_ID",
    },
    {
      title: "Vendor Code",
      dataIndex: "Vendor_Code",
    },
    {
      title: "Supplier",
      dataIndex: "Supplier",
    },
    {
      title: "Supplier material ID",
      dataIndex: "Supplier_Material_ID",
    },
    {
      title: "Supplier Material Name",
      dataIndex: "Supplier_Material_Name",
    },
    {
      title: "Mtl - Supp Lifecycle State",
      dataIndex: "Mtl_Supp_Lifecycle_State",
    },
    {
      title: "Material Type Level 1",
      dataIndex: "Material_Type_Level_1",
    },
    {
      title: "Composition",
      dataIndex: "Composition",
    },
    {
      title: "Classification",
      dataIndex: "Classification",
    },
    {
      title: "Material Thickness",
      dataIndex: "Material_Thickness",
    },
    {
      title: "Comparison UOM",
      dataIndex: "Comparison_UOM",
    },
    {
      title: "Price Remark",
      dataIndex: "Price_Remark",
    },
    {
      title: "Composition",
      dataIndex: "Composition",
    },
    {
      title: "Skin Size",
      dataIndex: "Skin_Size",
    },
    {
      title: "QC%",
      dataIndex: "QC_Percent",
    },
    {
      title: "Leadtime",
      dataIndex: "Leadtime",
    },
    {
      title: "Sample Leadtime",
      dataIndex: "Sample_Leadtime",
    },
    {
      title: "Min Qty/ Color",
      dataIndex: "Min_Qty_Color",
    },
    {
      title: "Min Qty/ Sample",
      dataIndex: "Min_Qty_Sample",
    },
    {
      title: "Production Location",
      dataIndex: "Production_Location",
    },
    {
      title: "Terms of Delivery per T1 Country",
      dataIndex: "Terms_of_Delivery_per_T1_Country",
    },
    {
      title: "Valid From (Price)",
      dataIndex: "Valid_From_Price",
    },
    {
      title: "Valid To (Price)",
      dataIndex: "Valid_To_Price",
    },
    {
      title: "Price Type",
      dataIndex: "Price_Type",
    },
    {
      title: "Color Code (Price)",
      dataIndex: "Color_Code_Price",
    },
    {
      title: "Color (Price)",
      dataIndex: "Color_Price",
    },
    {
      title: "Treatment (Price)",
      dataIndex: "Treatment_Price",
    },
    {
      title: "Width (Price)",
      dataIndex: "Width_Price",
    },
    {
      title: "Width Uom (Price)",
      dataIndex: "Width_Uom_Price",
    },
    {
      title: "Length (Price)",
      dataIndex: "Length_Price",
    },
    {
      title: "Length Uom (Price)",
      dataIndex: "Length_Uom_Price",
    },
    {
      title: "Thickness (Price)",
      dataIndex: "Thickness_Price",
    },
    {
      title: "Thickness Uom (Price)",
      dataIndex: "Thickness_Uom_Price",
    },
    {
      title: "Diameter Inside (Price)",
      dataIndex: "Diameter_Inside_Price",
    },
    {
      title: "Diameter Inside Uom (Price)",
      dataIndex: "Diameter_Inside_Uom_Price",
    },
    {
      title: "Weight (Price)",
      dataIndex: "Weight_Price",
    },
    {
      title: "Weight Uom (Price)",
      dataIndex: "Weight_Uom_Price",
    },
    {
      title: "Quantity (Price)",
      dataIndex: "Quantity_Price",
    },
    {
      title: "Quantity Uom (Price)",
      dataIndex: "Quantity_Uom_Price",
    },
    {
      title: "SS26 Final Price (USD)",
      dataIndex: "SS26_Final_Price_USD",
    },
    {
      title: "Comparison Price (Price) (USD)",
      dataIndex: "Comparison_Price_Price_USD",
    },
    {
      title: "Approved as Final Price Y/N (Price)",
      dataIndex: "Approved_As_Final_Price_Y_N_Price",
    },
    {
      title: "Season",
      dataIndex: "Season",
    },
    {
      title: "Attachment",
      dataIndex: "FileName",
      render: (value: string | undefined, record) =>
        value ? (
          <a
            href={record.FilePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 font-medium hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        ) : null,
    },
  ];
// return normalizeColumns(columns, ["Images", "FileName"]);
// };
