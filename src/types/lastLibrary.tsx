import type { ColumnsType } from "antd/es/table";

export interface LastLibraryResponse {
  data: LastLibraryDataType[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LastLibraryDataType {
  LastLibraryID: string;
  Season_M: string;
  Creation_Workflow_M: string;
  Model_Number_M: string;
  Article_Number_A: string;
  Model_Name_Short_M: string;
  Sports_Category_M: string;
  Development_Type_A: string;
  Group_Name_A: string;
  Development_Factory_M: string;
  Digital_Scope_A: string;
  Digital_Scope_Update_Date_A: string;
  Marketing_Department_A: string;
  Preview_Final_Rendering_available_Downstream_Date_A: string;
  Presell_Final_Rendering_available_Downstream_Date_A: string;
  SMS_Final_Rendering_available_Downstream_Date_A: string;
  MCS_Final_rendering_available_Downstream_Date_A: string;
  Article_Status_A: string;
  Carry_Over_Season_A: string;
  Consumer_Testing_A: string;
  Image_Launch_Date_A: string;
  Developer_A: string;
  Senior_Developer_A: string;
  Drop_Date_A: string;
  Factory_3D_A: string;
  Tags_A: string;
  Preview_Approval_Publish_Date_A: string;
  Presell_Approval_Publish_Date_A: string;
  SMS_Approval_Publish_Date_A: string;
  MCS_Approval_Publish_Date_A: string;
  Published_by_A: string;
  Published_Milestone_Timestamp_A: string;
  Published_Milestone_A: string;
  Expected_Milestone_A: string;
  HQ_Render_Status_Timestamp_A: string;
  HQ_Render_Status_A: string;
  Design_Sketch_Latest_Update_A: string;
  Feasibility_Checked_Date_A: string;
  Image_Confidential_A: string;
  Last_M: string;
  Test_3D?: File | string;
}

interface LastLibraryFormValues {
  key: number;
  Season_M: string;
  Creation_Workflow_M: string;
  Model_Number_M: string;
  Article_Number_A: string;
  Model_Name_Short_M: string;
  Sports_Category_M: string;
  Development_Type_A: string;
  Group_Name_A: string;
  Development_Factory_M: string;
  Digital_Scope_A: string;
  Digital_Scope_Update_Date_A: string;
  Marketing_Department_A: string;
  Preview_Final_Rendering_available_Downstream_Date_A: string;
  Presell_Final_Rendering_available_Downstream_Date_A: string;
  SMS_Final_Rendering_available_Downstream_Date_A: string;
  MCS_Final_rendering_available_Downstream_Date_A: string;
  Article_Status_A: string;
  Carry_Over_Season_A: string;
  Consumer_Testing_A: string;
  Image_Launch_Date_A: string;
  Developer_A: string;
  Senior_Developer_A: string;
  Drop_Date_A: string;
  Factory_3D_A: string;
  Tags_A: string;
  Preview_Approval_Publish_Date_A: string;
  Presell_Approval_Publish_Date_A: string;
  SMS_Approval_Publish_Date_A: string;
  MCS_Approval_Publish_Date_A: string;
  Published_by_A: string;
  Published_Milestone_Timestamp_A: string;
  Published_Milestone_A: string;
  Expected_Milestone_A: string;
  HQ_Render_Status_Timestamp_A: string;
  HQ_Render_Status_A: string;
  Design_Sketch_Latest_Update_A: string;
  Feasibility_Checked_Date_A: string;
  Image_Confidential_A: string;
  Last_M: string;
  Test_3D?: File | string;
}

export interface LastLibraryModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<LastLibraryFormValues> | null;
  onCancel: () => void;
  onSubmit: (values: LastLibraryFormValues) => Promise<void>;
}

export const getLastLibraryColumns = (
  //   onPreview: (images: (Image | File)[]) => void,
  //   onView: (record: LastLibraryDataType) => void,
  onView3D: (file: File) => void,
): ColumnsType<LastLibraryDataType> =>
  // {
  // const columns: ColumnsType<LastLibraryDataType> =
  [
    // {
    //   title: "Action",
    //   key: "action",
    //   width: 70,
    //   align: "center",
    //   render: (_, record) => (
    //     <div className="flex items-center justify-center h-full">
    //       <SafeTooltip title={"Show material detail information"}>
    //         <Eye
    //           className="cursor-pointer h-4"
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             onView(record);
    //           }}
    //         />
    //       </SafeTooltip>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Image",
    //   dataIndex: "Images",
    //   align: "center",
    //   // onCell: () => ({
    //   //   onClick: (e) => e.stopPropagation(),
    //   // }),
    //   render: (images?: (Image | File)[]) => {
    //     const validImages = Array.isArray(images)
    //       ? sortImagesByType(images)
    //       : [];

    //     if (!validImages.length) return null;

    //     const columns = Math.min(2, validImages.length);

    //     return (
    //       <div className="flex justify-center">
    //         <div
    //           className="grid gap-2 w-fit cursor-pointer"
    //           style={{ gridTemplateColumns: `repeat(${columns}, 64px)` }}
    //           onClick={(e) => {
    //             const previewImages = validImages.filter(
    //               (img): img is Image | File => img !== null,
    //             );

    //             onPreview(previewImages);
    //             e.stopPropagation();
    //           }}
    //         >
    //           {validImages.map((img, index) => {
    //             const src = resolveImageSrc(img);

    //             return (
    //               <img
    //                 key={index}
    //                 src={src}
    //                 className="w-16 h-12 object-cover rounded cursor-zoom-in hover:scale-110 hover:shadow-md transition-all duration-200 border border-[#8f8f8f]"
    //                 onLoad={() => {
    //                   if (img instanceof File) {
    //                     URL.revokeObjectURL(src);
    //                   }
    //                 }}
    //                 // onClick={(e) => e.stopPropagation()}
    //                 // onError={(e) => e.stopPropagation()}
    //               />
    //             );
    //           })}
    //         </div>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Season (M)",
      dataIndex: "Season_M",
    },
    {
      title: "Creation Workflow (M)",
      dataIndex: "Creation_Workflow_M",
    },
    {
      title: "Model Number (M)",
      dataIndex: "Model_Number_M",
    },
    {
      title: "Article Number (A)",
      dataIndex: "Article_Number_A",
    },
    {
      title: "Modal Name Short (M)",
      dataIndex: "Model_Name_Short_M",
    },
    {
      title: "Sports Category (M)",
      dataIndex: "Sports_Category_M",
    },
    {
      title: "Development Type (A)",
      dataIndex: "Development_Type_A",
    },
    {
      title: "Group Name (A)",
      dataIndex: "Group_Name_A",
    },
    {
      title: "Development Factory (M)",
      dataIndex: "Development_Factory_M",
    },
    {
      title: "Digital Scope (A)",
      dataIndex: "Digital_Scope_A",
    },
    {
      title: "Digital Scope Update Date (A)",
      dataIndex: "Digital_Scope_Update_Date_A",
    },
    {
      title: "Marketing Department (A)",
      dataIndex: "Marketing_Department_A",
    },
    {
      title: "Preview Final Rendering available Downstream Date (A)",
      dataIndex: "Preview_Final_Rendering_available_Downstream_Date_A",
    },
    {
      title: "Pre-sell Final Rendering available Downstream Date (A)",
      dataIndex: "Presell_Final_Rendering_available_Downstream_Date_A",
    },
    {
      title: "SMS Final Rendering available Downstream Date (A)",
      dataIndex: "SMS_Final_Rendering_available_Downstream_Date_A",
    },
    {
      title: "MCS Final rendering available Downstream Date (A)",
      dataIndex: "MCS_Final_rendering_available_Downstream_Date_A",
    },
    {
      title: "Article Status (A)",
      dataIndex: "Article_Status_A",
    },
    {
      title: "Carry Over Season (A)",
      dataIndex: "Carry_Over_Season_A",
    },
    {
      title: "Consumer Testing (A)",
      dataIndex: "Consumer_Testing_A",
    },
    {
      title: "Image Launch Date (A)",
      dataIndex: "Image_Launch_Date_A",
    },
    {
      title: "Developer (A)",
      dataIndex: "Developer_A",
    },
    {
      title: "Senior Developer (A)",
      dataIndex: "Senior_Developer_A",
    },
    {
      title: "Drop Date (A)",
      dataIndex: "Drop_Date_A",
    },
    {
      title: "3D Factory (A)",
      dataIndex: "Factory_3D_A",
    },
    {
      title: "Tags (A)",
      dataIndex: "Tags_A",
    },
    {
      title: "Preview Approval/Publish Date (A)",
      dataIndex: "Preview_Approval_Publish_Date_A",
    },
    {
      title: "Pre-sell Approval/Publish Date (A)",
      dataIndex: "Presell_Approval_Publish_Date_A",
    },
    {
      title: "SMS Approval/Publish Date (A)",
      dataIndex: "SMS_Approval_Publish_Date_A",
    },
    {
      title: "MCS Approval/Publish Date (A)",
      dataIndex: "MCS_Approval_Publish_Date_A",
    },
    {
      title: "Published by (A)",
      dataIndex: "Published_by_A",
    },
    {
      title: "Published Milestone Timestamp (A)",
      dataIndex: "Published_Milestone_Timestamp_A",
    },
    {
      title: "Published Milestone (A)",
      dataIndex: "Published_Milestone_A",
    },
    {
      title: "Expected Milestone (A)",
      dataIndex: "Expected_Milestone_A",
    },
    {
      title: "HQ Render Status Timestamp (A)",
      dataIndex: "HQ_Render_Status_Timestamp_A",
    },
    {
      title: "HQ Render Status (A)",
      dataIndex: "HQ_Render_Status_A",
    },
    {
      title: "Design Sketch Latest Update (A)",
      dataIndex: "Design_Sketch_Latest_Update_A",
    },
    {
      title: "Feasibility Checked Date (A)",
      dataIndex: "Feasibility_Checked_Date_A",
    },
    {
      title: "Image Confidential (A)",
      dataIndex: "Image_Confidential_A",
    },
    {
      title: "Last (M)",
      dataIndex: "Last_M",
    },
    {
      title: "Test 3D",
      dataIndex: "Test_3D",
      render: (value: File | string | undefined): React.ReactNode => {
        if (!value) return null;

        if (value instanceof File) {
          return (
            <a
              className="text-gray-600 font-medium hover:underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onView3D?.(value);
              }}
            >
              {value.name}
            </a>
          );
        }

        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 font-medium hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        );
      },
    },
    // {
    //   title: "Attachment",
    //   dataIndex: "FileName",
    //   render: (value: string | undefined, record) =>
    //     value ? (
    //       <a
    //         href={record.FilePath}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="text-gray-600 font-medium hover:underline"
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         {value}
    //       </a>
    //     ) : null,
    // },
  ];
// return normalizeColumns(columns, ["Images", "FileName"]);
// };
