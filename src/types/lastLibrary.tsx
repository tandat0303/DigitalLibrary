// import type { ColumnsType } from "antd/es/table";
// import { FileBox } from "lucide-react";

// export interface LastLibraryResponse {
//   data: LastLibraryDataType[];
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// export interface LastLibraryDataType {
//   LastLibraryID: string;
//   Season_M: string;
//   Creation_Workflow_M: string;
//   Model_Number_M: string;
//   Article_Number_A: string;
//   Model_Name_Short_M: string;
//   Sports_Category_M: string;
//   Development_Type_A: string;
//   Group_Name_A: string;
//   Development_Factory_M: string;
//   Digital_Scope_A: string;
//   Digital_Scope_Update_Date_A: string;
//   Marketing_Department_A: string;
//   Preview_Final_Rendering_available_Downstream_Date_A: string;
//   Presell_Final_Rendering_available_Downstream_Date_A: string;
//   SMS_Final_Rendering_available_Downstream_Date_A: string;
//   MCS_Final_rendering_available_Downstream_Date_A: string;
//   Article_Status_A: string;
//   Carry_Over_Season_A: string;
//   Consumer_Testing_A: string;
//   Image_Launch_Date_A: string;
//   Developer_A: string;
//   Senior_Developer_A: string;
//   Drop_Date_A: string;
//   Factory_3D_A: string;
//   Tags_A: string;
//   Preview_Approval_Publish_Date_A: string;
//   Presell_Approval_Publish_Date_A: string;
//   SMS_Approval_Publish_Date_A: string;
//   MCS_Approval_Publish_Date_A: string;
//   Published_by_A: string;
//   Published_Milestone_Timestamp_A: string;
//   Published_Milestone_A: string;
//   Expected_Milestone_A: string;
//   HQ_Render_Status_Timestamp_A: string;
//   HQ_Render_Status_A: string;
//   Design_Sketch_Latest_Update_A: string;
//   Feasibility_Checked_Date_A: string;
//   Image_Confidential_A: string;
//   Last_M: string;
//   LastLibrary3DMID: string;
//   FileName: string;
//   FilePath: string;
// }

// interface LastLibraryFormValues {
//   key: number;
//   Season_M: string;
//   Creation_Workflow_M: string;
//   Model_Number_M: string;
//   Article_Number_A: string;
//   Model_Name_Short_M: string;
//   Sports_Category_M: string;
//   Development_Type_A: string;
//   Group_Name_A: string;
//   Development_Factory_M: string;
//   Digital_Scope_A: string;
//   Digital_Scope_Update_Date_A: string;
//   Marketing_Department_A: string;
//   Preview_Final_Rendering_available_Downstream_Date_A: string;
//   Presell_Final_Rendering_available_Downstream_Date_A: string;
//   SMS_Final_Rendering_available_Downstream_Date_A: string;
//   MCS_Final_rendering_available_Downstream_Date_A: string;
//   Article_Status_A: string;
//   Carry_Over_Season_A: string;
//   Consumer_Testing_A: string;
//   Image_Launch_Date_A: string;
//   Developer_A: string;
//   Senior_Developer_A: string;
//   Drop_Date_A: string;
//   Factory_3D_A: string;
//   Tags_A: string;
//   Preview_Approval_Publish_Date_A: string;
//   Presell_Approval_Publish_Date_A: string;
//   SMS_Approval_Publish_Date_A: string;
//   MCS_Approval_Publish_Date_A: string;
//   Published_by_A: string;
//   Published_Milestone_Timestamp_A: string;
//   Published_Milestone_A: string;
//   Expected_Milestone_A: string;
//   HQ_Render_Status_Timestamp_A: string;
//   HQ_Render_Status_A: string;
//   Design_Sketch_Latest_Update_A: string;
//   Feasibility_Checked_Date_A: string;
//   Image_Confidential_A: string;
//   Last_M: string;
//   LastLibrary3DMID: string;
//   FileName: string;
//   FilePath: string;
// }

// export interface LastLibraryModalProps {
//   open: boolean;
//   mode: "create" | "edit";
//   initialValues?: Partial<LastLibraryFormValues> | null;
//   onCancel: () => void;
//   onSubmit: (values: LastLibraryFormValues) => Promise<void>;
// }

// export const getLastLibraryColumns = (
//   onView3D: (filePath: string, fileName: string) => void,
// ): ColumnsType<LastLibraryDataType> =>
//   // {
//   // const columns: ColumnsType<LastLibraryDataType> =
//   [
//     {
//       title: "3D Model",
//       dataIndex: "FileName",
//       render: (_, record) => {
//         if (!record.FileName || !record.FilePath) return null;

//         return (
//           <div
//             className="flex items-center gap-2 text-blue-500 font-medium hover:underline cursor-pointer"
//             onClick={(e) => {
//               e.stopPropagation();
//               onView3D(record.FilePath, record.FileName);
//             }}
//           >
//             <FileBox size={20} />
//             {record.FileName}
//           </div>
//         );
//       },
//     },
//     {
//       title: "Season (M)",
//       dataIndex: "Season_M",
//     },
//     {
//       title: "Creation Workflow (M)",
//       dataIndex: "Creation_Workflow_M",
//     },
//     {
//       title: "Model Number (M)",
//       dataIndex: "Model_Number_M",
//     },
//     {
//       title: "Article Number (A)",
//       dataIndex: "Article_Number_A",
//     },
//     {
//       title: "Modal Name Short (M)",
//       dataIndex: "Model_Name_Short_M",
//     },
//     {
//       title: "Sports Category (M)",
//       dataIndex: "Sports_Category_M",
//     },
//     {
//       title: "Development Type (A)",
//       dataIndex: "Development_Type_A",
//     },
//     {
//       title: "Group Name (A)",
//       dataIndex: "Group_Name_A",
//     },
//     {
//       title: "Development Factory (M)",
//       dataIndex: "Development_Factory_M",
//     },
//     {
//       title: "Digital Scope (A)",
//       dataIndex: "Digital_Scope_A",
//     },
//     {
//       title: "Digital Scope Update Date (A)",
//       dataIndex: "Digital_Scope_Update_Date_A",
//     },
//     {
//       title: "Marketing Department (A)",
//       dataIndex: "Marketing_Department_A",
//     },
//     {
//       title: "Preview Final Rendering available Downstream Date (A)",
//       dataIndex: "Preview_Final_Rendering_available_Downstream_Date_A",
//     },
//     {
//       title: "Pre-sell Final Rendering available Downstream Date (A)",
//       dataIndex: "Presell_Final_Rendering_available_Downstream_Date_A",
//     },
//     {
//       title: "SMS Final Rendering available Downstream Date (A)",
//       dataIndex: "SMS_Final_Rendering_available_Downstream_Date_A",
//     },
//     {
//       title: "MCS Final rendering available Downstream Date (A)",
//       dataIndex: "MCS_Final_rendering_available_Downstream_Date_A",
//     },
//     {
//       title: "Article Status (A)",
//       dataIndex: "Article_Status_A",
//     },
//     {
//       title: "Carry Over Season (A)",
//       dataIndex: "Carry_Over_Season_A",
//     },
//     {
//       title: "Consumer Testing (A)",
//       dataIndex: "Consumer_Testing_A",
//     },
//     {
//       title: "Image Launch Date (A)",
//       dataIndex: "Image_Launch_Date_A",
//     },
//     {
//       title: "Developer (A)",
//       dataIndex: "Developer_A",
//     },
//     {
//       title: "Senior Developer (A)",
//       dataIndex: "Senior_Developer_A",
//     },
//     {
//       title: "Drop Date (A)",
//       dataIndex: "Drop_Date_A",
//     },
//     {
//       title: "3D Factory (A)",
//       dataIndex: "Factory_3D_A",
//     },
//     {
//       title: "Tags (A)",
//       dataIndex: "Tags_A",
//     },
//     {
//       title: "Preview Approval/Publish Date (A)",
//       dataIndex: "Preview_Approval_Publish_Date_A",
//     },
//     {
//       title: "Pre-sell Approval/Publish Date (A)",
//       dataIndex: "Presell_Approval_Publish_Date_A",
//     },
//     {
//       title: "SMS Approval/Publish Date (A)",
//       dataIndex: "SMS_Approval_Publish_Date_A",
//     },
//     {
//       title: "MCS Approval/Publish Date (A)",
//       dataIndex: "MCS_Approval_Publish_Date_A",
//     },
//     {
//       title: "Published by (A)",
//       dataIndex: "Published_by_A",
//     },
//     {
//       title: "Published Milestone Timestamp (A)",
//       dataIndex: "Published_Milestone_Timestamp_A",
//     },
//     {
//       title: "Published Milestone (A)",
//       dataIndex: "Published_Milestone_A",
//     },
//     {
//       title: "Expected Milestone (A)",
//       dataIndex: "Expected_Milestone_A",
//     },
//     {
//       title: "HQ Render Status Timestamp (A)",
//       dataIndex: "HQ_Render_Status_Timestamp_A",
//     },
//     {
//       title: "HQ Render Status (A)",
//       dataIndex: "HQ_Render_Status_A",
//     },
//     {
//       title: "Design Sketch Latest Update (A)",
//       dataIndex: "Design_Sketch_Latest_Update_A",
//     },
//     {
//       title: "Feasibility Checked Date (A)",
//       dataIndex: "Feasibility_Checked_Date_A",
//     },
//     {
//       title: "Image Confidential (A)",
//       dataIndex: "Image_Confidential_A",
//     },
//     {
//       title: "Last (M)",
//       dataIndex: "Last_M",
//     },
//   ];
// // return normalizeColumns(columns, ["Images", "FileName"]);
// // };

import type { ColumnsType } from "antd/es/table";
import {
  // FileBox,
  Upload,
} from "lucide-react";
import ChipCell from "../lib/chipCell";
import { Tag } from "antd";
import GreenTick from "../assets/green-tick.png";

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
  Sizes: SizeEntry[];
}
export interface RefModelEntry {
  model: string;
  articles: string[];
}

export interface SizeEntry {
  size: string;
  refModels: RefModelEntry[];
}

export interface FlatLastLibraryRow extends LastLibraryDataType {
  _flatKey: string;
  _size: string;
  _refModel: string;
  _refArticles: string[];
  _seasonRowSpan: number;
  _lastRowSpan: number;
  _sizeRowSpan: number;
}

export function flattenLastLibraryData(
  records: LastLibraryDataType[],
): FlatLastLibraryRow[] {
  const flat: FlatLastLibraryRow[] = [];

  let i = 0;
  while (i < records.length) {
    const currentSeason = records[i].Season_M;

    let j = i;
    const seasonGroup: LastLibraryDataType[] = [];
    while (j < records.length && records[j].Season_M === currentSeason) {
      seasonGroup.push(records[j]);
      j++;
    }

    const seasonTotalRows = seasonGroup.reduce(
      (sum, rec) => sum + countFlatRows(rec),
      0,
    );

    let seasonRowsEmitted = 0;

    for (const record of seasonGroup) {
      const sizes: SizeEntry[] = record.Sizes?.length
        ? record.Sizes
        : [{ size: "", refModels: [{ model: "", articles: [] }] }];

      const recordTotalRows = countFlatRows(record);
      let recordRowsEmitted = 0;

      for (const sizeEntry of sizes) {
        const refModels: RefModelEntry[] = sizeEntry.refModels?.length
          ? sizeEntry.refModels
          : [{ model: "", articles: [] }];

        const sizeTotalRows = refModels.length;

        refModels.forEach((refModelEntry, mIdx) => {
          flat.push({
            ...record,
            _flatKey: `${record.LastLibraryID}_${sizeEntry.size}_${mIdx}`,
            _size: sizeEntry.size,
            _refModel: refModelEntry.model,
            _refArticles: refModelEntry.articles,
            _seasonRowSpan: seasonRowsEmitted === 0 ? seasonTotalRows : 0,
            _lastRowSpan: recordRowsEmitted === 0 ? recordTotalRows : 0,
            _sizeRowSpan: mIdx === 0 ? sizeTotalRows : 0,
          });
          seasonRowsEmitted++;
          recordRowsEmitted++;
        });
      }
    }

    i = j;
  }

  return flat;
}

function countFlatRows(record: LastLibraryDataType): number {
  if (!record.Sizes?.length) return 1;
  return record.Sizes.reduce(
    (sum, s) => sum + Math.max(s.refModels?.length ?? 0, 1),
    0,
  );
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
  Sizes: SizeEntry[];
}

export interface LastLibraryModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<LastLibraryFormValues> | null;
  onCancel: () => void;
  onSubmit: (values: LastLibraryFormValues) => Promise<void>;
}

const MAX_CHIPS = 2;

export const getLastLibraryColumns = (
  // onView3D: (filePath: string, fileName: string) => void,
  sizeLocalMap: Record<string, { url: string; name: string }>,
  onUploadSize: (sizeKey: string, url: string, fileName: string) => void,
  onViewSize3D: (url: string, name: string) => void,
): ColumnsType<FlatLastLibraryRow> => [
  // {
  //   title: "3D Model",
  //   dataIndex: "FileName",
  //   onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  //   render: (_, record) => {
  //     if (!record.FileName || !record.FilePath) return null;
  //     return (
  //       <div
  //         className="flex items-center gap-2 text-blue-500 font-medium hover:underline cursor-pointer"
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           onView3D(record.FilePath, record.FileName);
  //         }}
  //       >
  //         <FileBox size={20} />
  //         {record.FileName}
  //       </div>
  //     );
  //   },
  // },
  {
    title: "Season (M)",
    dataIndex: "Season_M",
    onCell: (record) => ({ rowSpan: record._seasonRowSpan }),
    render: (value: string) => (
      <span className="font-medium">{value || ""}</span>
    ),
  },
  {
    title: "Last (M)",
    dataIndex: "Last_M",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
    render: (value: string) => value || "",
  },
  // {
  //   title: "Size",
  //   dataIndex: "_size",
  //   onCell: (record) => ({ rowSpan: record._sizeRowSpan }),
  //   render: (value: string, record) => {
  //     if (!value) return <span className="text-gray-300">—</span>;

  //     const sizeKey = `${record.LastLibraryID}__${value}`;
  //     const local = sizeLocalMap[sizeKey];

  //     if (local?.url) {
  //       return (
  //         <div
  //           className="flex items-center gap-2 text-blue-500 font-medium hover:underline cursor-pointer"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             onViewSize3D(local.url, local.name);
  //           }}
  //         >
  //           <FileBox size={16} />
  //           <span className="flex items-center gap-1">
  //             <img
  //               src={GreenTick}
  //               alt="attached"
  //               style={{ width: 14, height: 14, flexShrink: 0 }}
  //             />
  //             {value}
  //           </span>
  //         </div>
  //       );
  //     }

  //     return (
  //       <Tag color="default" style={{ margin: 0 }}>
  //         {value}
  //       </Tag>
  //     );
  //   },
  // },
  {
    title: "Size",
    dataIndex: "_size",
    onCell: (record) => ({ rowSpan: record._sizeRowSpan }),
    render: (value: string, record) => {
      if (!value) return <span className="text-gray-300">—</span>;

      const sizeKey = `${record.LastLibraryID}__${value}`;
      const local = sizeLocalMap[sizeKey];

      if (local) {
        return (
          <div
            className="flex items-center gap-2 text-blue-500 font-medium hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onViewSize3D(local.url, local.name);
            }}
          >
            <span className="flex items-center gap-1">
              <img
                src={GreenTick}
                alt="attached"
                className="w-5 h-5 shrink-0 mr-1"
              />
              {local.name}
            </span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <Tag color="default" style={{ margin: 0 }}>
            {value}
          </Tag>
          <label
            title="Attach .3DM file for this size"
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: "pointer", lineHeight: 0 }}
          >
            <input
              type="file"
              accept=".3dm"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  onUploadSize(sizeKey, url, file.name);
                }
                e.target.value = "";
              }}
            />
            <Upload size={13} className="text-gray-400 hover:text-blue-500" />
          </label>
        </div>
      );
    },
  },
  {
    title: "Ref Model",
    dataIndex: "_refModel",
    render: (value: string) =>
      value ? (
        <Tag color="blue" style={{ margin: 0 }}>
          {value}
        </Tag>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    title: "Ref Articles",
    dataIndex: "_refArticles",
    render: (items: string[]) => (
      <ChipCell
        items={items}
        label="Ref Articles"
        color="green"
        maxChips={MAX_CHIPS}
      />
    ),
  },
  {
    title: "Creation Workflow (M)",
    dataIndex: "Creation_Workflow_M",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Model Number (M)",
    dataIndex: "Model_Number_M",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Article Number (A)",
    dataIndex: "Article_Number_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Modal Name Short (M)",
    dataIndex: "Model_Name_Short_M",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Sports Category (M)",
    dataIndex: "Sports_Category_M",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Development Type (A)",
    dataIndex: "Development_Type_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Group Name (A)",
    dataIndex: "Group_Name_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Development Factory (M)",
    dataIndex: "Development_Factory_M",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Digital Scope (A)",
    dataIndex: "Digital_Scope_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Digital Scope Update Date (A)",
    dataIndex: "Digital_Scope_Update_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Marketing Department (A)",
    dataIndex: "Marketing_Department_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Preview Final Rendering available Downstream Date (A)",
    dataIndex: "Preview_Final_Rendering_available_Downstream_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Pre-sell Final Rendering available Downstream Date (A)",
    dataIndex: "Presell_Final_Rendering_available_Downstream_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "SMS Final Rendering available Downstream Date (A)",
    dataIndex: "SMS_Final_Rendering_available_Downstream_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "MCS Final rendering available Downstream Date (A)",
    dataIndex: "MCS_Final_rendering_available_Downstream_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Article Status (A)",
    dataIndex: "Article_Status_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Carry Over Season (A)",
    dataIndex: "Carry_Over_Season_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Consumer Testing (A)",
    dataIndex: "Consumer_Testing_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Image Launch Date (A)",
    dataIndex: "Image_Launch_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Developer (A)",
    dataIndex: "Developer_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Senior Developer (A)",
    dataIndex: "Senior_Developer_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Drop Date (A)",
    dataIndex: "Drop_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "3D Factory (A)",
    dataIndex: "Factory_3D_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Tags (A)",
    dataIndex: "Tags_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Preview Approval/Publish Date (A)",
    dataIndex: "Preview_Approval_Publish_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Pre-sell Approval/Publish Date (A)",
    dataIndex: "Presell_Approval_Publish_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "SMS Approval/Publish Date (A)",
    dataIndex: "SMS_Approval_Publish_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "MCS Approval/Publish Date (A)",
    dataIndex: "MCS_Approval_Publish_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Published by (A)",
    dataIndex: "Published_by_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Published Milestone Timestamp (A)",
    dataIndex: "Published_Milestone_Timestamp_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Published Milestone (A)",
    dataIndex: "Published_Milestone_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Expected Milestone (A)",
    dataIndex: "Expected_Milestone_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "HQ Render Status Timestamp (A)",
    dataIndex: "HQ_Render_Status_Timestamp_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "HQ Render Status (A)",
    dataIndex: "HQ_Render_Status_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Design Sketch Latest Update (A)",
    dataIndex: "Design_Sketch_Latest_Update_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Feasibility Checked Date (A)",
    dataIndex: "Feasibility_Checked_Date_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
  {
    title: "Image Confidential (A)",
    dataIndex: "Image_Confidential_A",
    onCell: (record) => ({ rowSpan: record._lastRowSpan }),
  },
];
