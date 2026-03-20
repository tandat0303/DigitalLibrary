import type { ColumnsType } from "antd/es/table";
import { FileBox } from "lucide-react";

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
  LastLibrary3DMID: string;
  FileName: string;
  FilePath: string;
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
  LastLibrary3DMID: string;
  FileName: string;
  FilePath: string;
}

export interface LastLibraryModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<LastLibraryFormValues> | null;
  onCancel: () => void;
  onSubmit: (values: LastLibraryFormValues) => Promise<void>;
}

export const getLastLibraryColumns = (
  onView3D: (filePath: string, fileName: string) => void,
): ColumnsType<LastLibraryDataType> =>
  // {
  // const columns: ColumnsType<LastLibraryDataType> =
  [
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
      title: "3D Model",
      dataIndex: "FileName",
      render: (_, record) => {
        if (!record.FileName || !record.FilePath) return null;

        return (
          <div
            className="flex items-center gap-2 text-blue-500 font-medium hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onView3D(record.FilePath, record.FileName);
            }}
          >
            <FileBox size={20} />
            {record.FileName}
          </div>
        );
      },
    },
  ];
// return normalizeColumns(columns, ["Images", "FileName"]);
// };
