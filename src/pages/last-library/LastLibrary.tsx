// import { useEffect, useState } from "react";
// import { Card, Input, Button, Table, Space, Row, Col, Form, Modal } from "antd";
// import CustomPagination from "../../components/CustomPagination";
// import { AppAlert } from "../../components/ui/AppAlert";

// import AddFilter from "../../components/AddFilter";
// import { FILTER_OPTIONS } from "../../components/ui/LastLibraryFilterOption";
// import { FileBox, Search, Upload } from "lucide-react";
// import { TbCube3dSphere } from "react-icons/tb";
// import FilterCollapse from "../../components/FilterCollapse";
// import { SafeTooltip } from "../../components/ui/Tooltip";
// import {
//   getLastLibraryColumns,
//   type LastLibraryDataType,
// } from "../../types/lastLibrary";
// import UploadAttachModal from "../../components/UploadAttachModal";
// import ThreeDMModal from "../../components/ThreeDMModal";
// import LastLibraryModal from "./LastLibraryModal";
// import { getApiErrorMessage } from "../../lib/getApiErrorMsg";
// import { buildQueryFilters } from "../../lib/buildQueryFilters";
// import { lastLibraryApi } from "../../api/lastLibrary.api";
// import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { useAppSelector } from "../../hooks/auth";
// import { SwalLoading } from "../../components/ui/SwalLoading";
// import Swal from "sweetalert2";
// import { SwalNotification } from "../../components/ui/SwalNotification";
// import ImportExcelModal from "../../components/ImportExcelModal";

// export default function LastLibrary() {
//   const [form] = Form.useForm();

//   const user = useAppSelector((state) => state.auth.user);

//   const [dynamicCount, setDynamicCount] = useState(0);

//   const [data, setData] = useState<LastLibraryDataType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<LastLibraryDataType | null>(
//     null,
//   );

//   const [openModal, setOpenModal] = useState(false);
//   const [mode, setMode] = useState<"create" | "edit">("create");

//   const [openImport, setOpenImport] = useState(false);
//   const [openUploadAttach, setOpenUploadAttach] = useState(false);

//   const [open3D, setOpen3D] = useState(false);
//   const [active3DUrl, setActive3DUrl] = useState<string | null>(null);
//   const [active3DName, setActive3DName] = useState<string>("");

//   const columns = getLastLibraryColumns((filePath, fileName) => {
//     setActive3DUrl(filePath);
//     setActive3DName(fileName);
//     setOpen3D(true);
//   });

//   const [current, setCurrent] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const [total, setTotal] = useState(0);
//   const [filters, setFilters] = useState<any>({});

//   const fetchItems = async () => {
//     try {
//       setLoading(true);

//       const params = { ...filters, page: current, limit: pageSize };

//       const res = await lastLibraryApi.getAllItems(params);

//       const rows = res.data.map((item: any) => ({
//         ...item,
//         key: item.ID,
//       }));

//       setData(rows);
//       setTotal(res.total);
//     } catch (error) {
//       console.log("Failed to fetch item: ", error);
//       AppAlert({ icon: "error", title: "Failed to fetch item" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, [current, pageSize, filters]);

//   const handleFilter = (values: any) => {
//     const newFilters = buildQueryFilters(values);

//     setFilters(newFilters);
//     setCurrent(1);
//   };

//   const handleSelectItem = (record: LastLibraryDataType) => {
//     if (selectedRow?.LastLibraryID === record.LastLibraryID) {
//       setSelectedRow(null);
//       return;
//     }

//     setSelectedRow(record);
//   };

//   const handleUploadAttach = async (file: File) => {
//     if (!selectedRow || !user) return;

//     try {
//       const formData = new FormData();

//       formData.append("file", file);

//       const res = await lastLibraryApi.attach3DM(
//         selectedRow.LastLibraryID,
//         formData,
//       );

//       if (res.data) AppAlert({ icon: "success", title: res.message });

//       await fetchItems();
//     } catch (error) {
//       console.error(error);
//       AppAlert({ icon: "error", title: getApiErrorMessage(error) });
//     }
//   };

//   const handleCreate = () => {
//     setMode("create");
//     setSelectedRow(null);
//     setOpenModal(true);
//   };

//   const handleEdit = () => {
//     if (!selectedRow) {
//       AppAlert({ icon: "warning", title: "Please choose a row data" });
//       return;
//     }

//     setMode("edit");
//     setOpenModal(true);
//   };

//   const handleDelete = async () => {
//     try {
//       if (!selectedRow) return;

//       const res = await lastLibraryApi.deleteItem(selectedRow.LastLibraryID);

//       if (res.success) {
//         setSelectedRow(null);
//         AppAlert({ icon: "success", title: res.message });
//       }

//       await fetchItems();
//     } catch (error) {
//       AppAlert({ icon: "error", title: getApiErrorMessage(error) });
//     }
//   };

//   const confirmRemove = () => {
//     if (!selectedRow) {
//       AppAlert({ icon: "warning", title: "Please choose a row data" });
//       return;
//     }

//     Modal.confirm({
//       title: "REMOVE MATERIAL",
//       content: "Are you sure to remove this item?",
//       okText: "Yes",
//       cancelText: "No",
//       okType: "danger",
//       centered: true,
//       icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
//       onOk: () => handleDelete(),
//     });
//   };

//   const handleImportExcel = async (file: File) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       SwalLoading("Uploading Excel file...");

//       const res = await lastLibraryApi.importExcelFile(formData);

//       Swal.close();

//       if (res) {
//         SwalNotification("success", res.message);

//         await fetchItems();
//       }
//     } catch (error) {
//       Swal.close();

//       SwalNotification("error", getApiErrorMessage(error));
//     }
//   };

//   const handleSubmit = async (values: any) => {
//     if (mode === "create") {
//       try {
//         await lastLibraryApi.createItem(values);

//         AppAlert({ icon: "success", title: "Added new item successfully" });

//         setOpenModal(false);
//         setSelectedRow(null);
//         await fetchItems();
//       } catch (error) {
//         AppAlert({ icon: "error", title: getApiErrorMessage(error) });
//       }
//     } else {
//       try {
//         if (!selectedRow) return;

//         await lastLibraryApi.updateItem(selectedRow.LastLibraryID, values);
//         AppAlert({ icon: "success", title: "Item updated successfully" });
//         setOpenModal(false);
//         setSelectedRow(null);
//         await fetchItems();
//       } catch (error) {
//         console.log(error);
//         AppAlert({ icon: "error", title: getApiErrorMessage(error) });
//       }
//     }
//   };

//   const handle3DViewer = () => {
//     if (!selectedRow) return;

//     if (!selectedRow.FilePath) {
//       AppAlert({
//         icon: "warning",
//         title: "No 3D file attached",
//       });
//       return;
//     }

//     setActive3DUrl(selectedRow.FilePath);
//     setActive3DName(selectedRow.FileName ?? "3D Model");
//     setOpen3D(true);
//   };

//   return (
//     <>
//       <Row gutter={24}>
//         <Col span={24}>
//           <FilterCollapse
//             form={form}
//             onFinish={handleFilter}
//             title="FILTERS"
//             extraFilters={
//               <AddFilter
//                 options={FILTER_OPTIONS}
//                 form={form}
//                 // colSpan={4}
//                 onChangeActiveCount={setDynamicCount}
//               />
//             }
//             visibleFilterCount={3 + dynamicCount}
//             actions={
//               <>
//                 <Form.Item>
//                   <Button className="btn-custom" htmlType="submit">
//                     <Search size={13} />
//                     Search
//                   </Button>
//                 </Form.Item>
//               </>
//             }
//           >
//             <Col xs={24} sm={12} md={8} lg={6} xl={4}>
//               <Form.Item name="Season_M" label="Season (M)">
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12} md={8} lg={6} xl={4}>
//               <Form.Item name="Model_Number_M" label="Model Number (M)">
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col xs={24} sm={12} md={8} lg={6} xl={4}>
//               <Form.Item name="Group_Name_A" label="Group Name (A)">
//                 <Input />
//               </Form.Item>
//             </Col>
//           </FilterCollapse>
//         </Col>
//       </Row>

//       <Row gutter={24}>
//         <Col span={24}>
//           <Card
//             style={{
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//             }}
//             styles={{
//               body: {
//                 flex: 1,
//                 display: "flex",
//                 flexDirection: "column",
//               },
//             }}
//           >
//             <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
//               <Space
//                 wrap
//                 className="w-full [&>*]:w-full lg:w-auto lg:[&>*]:w-auto"
//               >
//                 <SafeTooltip title={"Create new item"}>
//                   <Button
//                     className="add-btn w-full lg:w-auto"
//                     onClick={handleCreate}
//                   >
//                     NEW ITEM
//                   </Button>
//                 </SafeTooltip>

//                 <SafeTooltip title={"Update item information"}>
//                   <Button
//                     className="edit-btn w-full lg:w-auto"
//                     // disabled={!selectedRow}
//                     onClick={handleEdit}
//                   >
//                     EDIT ITEM
//                   </Button>
//                 </SafeTooltip>

//                 <SafeTooltip title={"Delete item"}>
//                   <Button
//                     className="delete-btn w-full lg:w-auto"
//                     // disabled={!selectedRow}
//                     onClick={confirmRemove}
//                   >
//                     REMOVE ITEM
//                   </Button>
//                 </SafeTooltip>

//                 <SafeTooltip title={"Import Excel file"}>
//                   <Button
//                     className="actions-btn w-full lg:w-auto"
//                     // icon={<Upload className="h-5" />}
//                     onClick={() => setOpenImport(true)}
//                   >
//                     <Upload />
//                   </Button>
//                 </SafeTooltip>

//                 <SafeTooltip title={"Upload 3D Modal file"}>
//                   <Button
//                     className="extra-actions-btn w-full lg:w-auto"
//                     // disabled={!selectedRow}
//                     onClick={() => {
//                       if (!selectedRow) {
//                         AppAlert({
//                           icon: "warning",
//                           title: "Please choose a row data",
//                         });
//                         return;
//                       }

//                       setOpenUploadAttach(true);
//                     }}
//                   >
//                     <FileBox className="w-4 h-4" />
//                     Attach 3DM file
//                   </Button>
//                 </SafeTooltip>

//                 <SafeTooltip title={"Show 3D Modal"}>
//                   <Button
//                     className="extra-actions-btn w-full lg:w-auto"
//                     onClick={handle3DViewer}
//                     disabled={!(selectedRow && selectedRow.FileName)}
//                   >
//                     <TbCube3dSphere className="h-4 w-4" />
//                     3D Viewer
//                   </Button>
//                 </SafeTooltip>
//               </Space>

//               <span className="adidas-font text-left lg:text-right">
//                 {total} items
//               </span>
//             </div>

//             <div className="w-full mt-1">
//               <Table
//                 loading={loading}
//                 bordered
//                 columns={columns}
//                 dataSource={data}
//                 rowKey="LastLibraryID"
//                 pagination={false}
//                 scroll={{ x: "max-content" }}
//                 onRow={(record) => ({
//                   onClick: () => {
//                     handleSelectItem(record);
//                   },
//                 })}
//                 rowClassName={(record) =>
//                   record.LastLibraryID &&
//                   record.LastLibraryID === selectedRow?.LastLibraryID
//                     ? "custom-selected-row"
//                     : ""
//                 }
//               />
//             </div>

//             <CustomPagination
//               total={total}
//               current={current}
//               pageSize={pageSize}
//               onChange={(page) => setCurrent(page)}
//               onPageSizeChange={(size) => setPageSize(size)}
//             />
//           </Card>
//         </Col>
//       </Row>

//       <LastLibraryModal
//         open={openModal}
//         mode={mode}
//         initialValues={mode === "edit" ? selectedRow : undefined}
//         onCancel={() => setOpenModal(false)}
//         onSubmit={handleSubmit}
//       />

//       <ImportExcelModal
//         open={openImport}
//         onClose={() => setOpenImport(false)}
//         sampleFileName="Ex_File_Last_Library"
//         onImport={(file) => {
//           if (!file) return;
//           handleImportExcel(file);
//           setOpenImport(false);
//         }}
//       />

//       <UploadAttachModal
//         open={openUploadAttach}
//         onClose={() => setOpenUploadAttach(false)}
//         onImport={(file) => {
//           if (!file || !selectedRow) return;
//           handleUploadAttach(file);
//           setOpenUploadAttach(false);
//           setSelectedRow(null);
//         }}
//         acceptedFormat=".3dm"
//       />

//       <ThreeDMModal
//         open={open3D}
//         fileUrl={active3DUrl}
//         fileName={active3DName}
//         onClose={() => {
//           setOpen3D(false);
//           setActive3DUrl(null);
//           setActive3DName("");
//           setSelectedRow(null);
//         }}
//       />
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Form } from "antd";
import { Search, Upload } from "lucide-react";

import { AppAlert } from "../../components/ui/AppAlert";
import AddFilter from "../../components/AddFilter";
import { FILTER_OPTIONS } from "../../components/ui/LastLibraryFilterOption";
import FilterCollapse from "../../components/FilterCollapse";
import {
  getLastLibraryColumns,
  flattenLastLibraryData,
  type LastLibraryDataType,
  type FlatLastLibraryRow,
} from "../../types/lastLibrary";
import UploadAttachModal from "../../components/UploadAttachModal";
import ThreeDMModal from "../../components/ThreeDMModal";
import LastLibraryModal from "./LastLibraryModal";
import { getApiErrorMessage } from "../../lib/getApiErrorMsg";
import { buildQueryFilters } from "../../lib/buildQueryFilters";
import { lastLibraryApi } from "../../api/lastLibrary.api";
import { useAppSelector } from "../../hooks/auth";
import { SwalLoading } from "../../components/ui/SwalLoading";
import Swal from "sweetalert2";
import { SwalNotification } from "../../components/ui/SwalNotification";
import ImportExcelModal from "../../components/ImportExcelModal";
import ConfirmRemoveModal from "../../components/ui/ConfirmRemoveModal";

import DataTableSection from "../../components/DataTableSection";

const SAMPLE_SIZES_POOL = [
  [
    {
      size: "EU40",
      refModels: [
        {
          model: "MDL-A001",
          articles: ["ART-10001", "ART-10002", "ART-10003"],
        },
        { model: "MDL-A002", articles: ["ART-10004", "ART-10005"] },
      ],
    },
    {
      size: "EU41",
      refModels: [{ model: "MDL-A003", articles: ["ART-10006"] }],
    },
    {
      size: "EU42",
      refModels: [
        { model: "MDL-A004", articles: ["ART-10007", "ART-10008"] },
        {
          model: "MDL-A005",
          articles: ["ART-10009", "ART-10010", "ART-10011"],
        },
      ],
    },
  ],
  [
    {
      size: "EU38",
      refModels: [{ model: "MDL-B001", articles: ["ART-20001", "ART-20002"] }],
    },
    {
      size: "EU39",
      refModels: [
        { model: "MDL-B002", articles: ["ART-20003", "ART-20004"] },
        { model: "MDL-B003", articles: ["ART-20005"] },
      ],
    },
  ],
  [
    {
      size: "EU43",
      refModels: [
        { model: "MDL-C001", articles: ["ART-30001"] },
        { model: "MDL-C002", articles: ["ART-30002", "ART-30003"] },
        {
          model: "MDL-C003",
          articles: ["ART-30004", "ART-30005", "ART-30006"],
        },
      ],
    },
    {
      size: "EU44",
      refModels: [{ model: "MDL-C004", articles: ["ART-30007", "ART-30008"] }],
    },
    {
      size: "EU45",
      refModels: [
        { model: "MDL-C005", articles: ["ART-30009"] },
        { model: "MDL-C006", articles: ["ART-30010", "ART-30011"] },
      ],
    },
  ],
  [
    {
      size: "EU41",
      refModels: [{ model: "MDL-D001", articles: ["ART-40001", "ART-40002"] }],
    },
    {
      size: "EU42",
      refModels: [
        { model: "MDL-D002", articles: ["ART-40003"] },
        { model: "MDL-D003", articles: ["ART-40004", "ART-40005"] },
      ],
    },
  ],
];

function mergeSampleSizes(item: any, index: number): LastLibraryDataType {
  return {
    ...item,
    Sizes: item.Sizes?.length
      ? item.Sizes
      : SAMPLE_SIZES_POOL[index % SAMPLE_SIZES_POOL.length],
  };
}

export default function LastLibrary() {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.user);

  const [dynamicCount, setDynamicCount] = useState(0);
  const [flatData, setFlatData] = useState<FlatLastLibraryRow[]>([]);
  const [rawData, setRawData] = useState<LastLibraryDataType[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedID, setSelectedID] = useState<string | null>(null);
  const selectedRow =
    rawData.find((r) => r.LastLibraryID === selectedID) ?? null;

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [openImport, setOpenImport] = useState(false);
  const [openUploadAttach, setOpenUploadAttach] = useState(false);

  const [open3D, setOpen3D] = useState(false);
  const [active3DUrl, setActive3DUrl] = useState<string | null>(null);
  const [active3DName, setActive3DName] = useState<string>("");

  const [openSize3D, setOpenSize3D] = useState(false);
  const [activeSize3DUrl, setActiveSize3DUrl] = useState<string | null>(null);
  const [activeSize3DName, setActiveSize3DName] = useState<string>("");

  const [sizeLocalMap, setSizeLocalMap] = useState<
    Record<string, { url: string; name: string }>
  >({});

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const columns = getLastLibraryColumns(
    sizeLocalMap,
    (sizeKey, url, fileName) => {
      setSizeLocalMap((prev) => ({
        ...prev,
        [sizeKey]: { url, name: fileName },
      }));
    },
    (url, name) => {
      setActiveSize3DUrl(url);
      setActiveSize3DName(name);
      setOpenSize3D(true);
    },
  );

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page: current, limit: pageSize };
      const res = await lastLibraryApi.getAllItems(params);
      const merged: LastLibraryDataType[] = res.data.map(
        (item: any, index: number) => mergeSampleSizes(item, index),
      );
      setRawData(merged);
      setFlatData(flattenLastLibraryData(merged));
      setTotal(res.total);
    } catch (error) {
      console.log("Failed to fetch item: ", error);
      AppAlert({ icon: "error", title: "Failed to fetch item" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [current, pageSize, filters]);

  const handleFilter = (values: any) => {
    setFilters(buildQueryFilters(values));
    setCurrent(1);
  };

  const handleSelectItem = (record: FlatLastLibraryRow) => {
    setSelectedID((prev) =>
      prev === record.LastLibraryID ? null : record.LastLibraryID,
    );
  };

  const handleCreate = () => {
    setMode("create");
    setSelectedID(null);
    setOpenModal(true);
  };

  const handleEdit = () => {
    if (!selectedRow) {
      AppAlert({ icon: "warning", title: "Please choose a row data" });
      return;
    }
    setMode("edit");
    setOpenModal(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectedRow) return;
      const res = await lastLibraryApi.deleteItem(selectedRow.LastLibraryID);
      if (res.success) {
        setSelectedID(null);
        AppAlert({ icon: "success", title: res.message });
      }
      await fetchItems();
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
  };

  const confirmRemove = () => {
    if (!selectedRow) {
      AppAlert({ icon: "warning", title: "Please choose a row data" });
      return;
    }
    ConfirmRemoveModal({ topic: "item", onOk: handleDelete });
  };

  const handleImportExcel = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      SwalLoading("Uploading Excel file...");
      const res = await lastLibraryApi.importExcelFile(formData);
      Swal.close();
      if (res) {
        SwalNotification("success", res.message);
        await fetchItems();
      }
    } catch (error) {
      Swal.close();
      SwalNotification("error", getApiErrorMessage(error));
    }
  };

  const handleUploadAttach = async (file: File) => {
    if (!selectedRow || !user) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await lastLibraryApi.attach3DM(
        selectedRow.LastLibraryID,
        formData,
      );
      if (res.data) AppAlert({ icon: "success", title: res.message });
      await fetchItems();
    } catch (error) {
      console.error(error);
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
  };

  // const handle3DViewer = () => {
  //   if (!selectedRow) return;

  //   if (!selectedRow.FilePath) {
  //     AppAlert({ icon: "warning", title: "No 3D file attached" });
  //     return;
  //   }

  //   setActive3DUrl(selectedRow.FilePath);
  //   setActive3DName(selectedRow.FileName ?? "3D Model");
  //   setOpen3D(true);
  // };

  const handleSubmit = async (values: any) => {
    if (mode === "create") {
      try {
        await lastLibraryApi.createItem(values);
        AppAlert({ icon: "success", title: "Added new item successfully" });
        setOpenModal(false);
        setSelectedID(null);
        await fetchItems();
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    } else {
      try {
        if (!selectedRow) return;
        await lastLibraryApi.updateItem(selectedRow.LastLibraryID, values);
        AppAlert({ icon: "success", title: "Item updated successfully" });
        setOpenModal(false);
        setSelectedID(null);
        await fetchItems();
      } catch (error) {
        console.log(error);
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    }
  };

  return (
    <>
      {/* ── Filters ── */}
      <Row gutter={24}>
        <Col span={24}>
          <FilterCollapse
            form={form}
            onFinish={handleFilter}
            title="FILTERS"
            extraFilters={
              <AddFilter
                options={FILTER_OPTIONS}
                form={form}
                onChangeActiveCount={setDynamicCount}
              />
            }
            visibleFilterCount={3 + dynamicCount}
            actions={
              <Form.Item>
                <Button className="btn-custom" htmlType="submit">
                  <Search size={13} />
                  Search
                </Button>
              </Form.Item>
            }
          >
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="Season_M" label="Season (M)">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="Model_Number_M" label="Model Number (M)">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="Group_Name_A" label="Group Name (A)">
                <Input />
              </Form.Item>
            </Col>
          </FilterCollapse>
        </Col>
      </Row>

      {/* ── Table card ── */}
      <DataTableSection<FlatLastLibraryRow>
        dataSource={flatData}
        columns={columns}
        rowKey="_flatKey"
        loading={loading}
        selectedRowKey={selectedID ?? undefined}
        rowClassNameFn={(record) =>
          record.LastLibraryID === selectedID ? "custom-selected-row" : ""
        }
        onRowClick={handleSelectItem}
        total={total}
        current={current}
        pageSize={pageSize}
        onPageChange={setCurrent}
        onPageSizeChange={setPageSize}
        actionBar={{
          totalLabel: `${total} items`,
          buttons: [
            {
              label: "NEW ITEM",
              tooltip: "Create new item",
              className: "add-btn",
              onClick: handleCreate,
            },
            {
              label: "EDIT ITEM",
              tooltip: "Update item information",
              className: "edit-btn",
              onClick: handleEdit,
            },
            {
              label: "REMOVE ITEM",
              tooltip: "Delete item",
              className: "delete-btn",
              onClick: confirmRemove,
            },
            {
              label: <Upload />,
              tooltip: "Import Excel file",
              className: "actions-btn",
              onClick: () => setOpenImport(true),
            },
            // {
            //   label: <><FileBox className="w-4 h-4" /> Attach 3DM file</>,
            //   tooltip: "Upload 3D Modal file",
            //   className: "extra-actions-btn",
            //   onClick: () => {
            //     if (!selectedRow) {
            //       AppAlert({ icon: "warning", title: "Please choose a row data" });
            //       return;
            //     }
            //     setOpenUploadAttach(true);
            //   },
            // },
            // {
            //   label: <><TbCube3dSphere className="h-4 w-4" /> 3D Viewer</>,
            //   tooltip: "Show 3D Modal",
            //   className: "extra-actions-btn",
            //   disabled: !(selectedRow && selectedRow.FileName),
            //   onClick: handle3DViewer,
            // },
          ],
        }}
      />

      <LastLibraryModal
        open={openModal}
        mode={mode}
        initialValues={mode === "edit" ? selectedRow : undefined}
        onCancel={() => setOpenModal(false)}
        onSubmit={handleSubmit}
      />

      <ImportExcelModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        sampleFileName="Ex_File_Last_Library"
        onImport={(file) => {
          if (!file) return;
          handleImportExcel(file);
          setOpenImport(false);
        }}
      />

      <UploadAttachModal
        open={openUploadAttach}
        onClose={() => setOpenUploadAttach(false)}
        onImport={(file) => {
          if (!file || !selectedRow) return;
          handleUploadAttach(file);
          setOpenUploadAttach(false);
          setSelectedID(null);
        }}
        acceptedFormat=".3dm"
      />

      <ThreeDMModal
        open={open3D}
        fileUrl={active3DUrl}
        fileName={active3DName}
        onClose={() => {
          setOpen3D(false);
          setActive3DUrl(null);
          setActive3DName("");
          setSelectedID(null);
        }}
      />

      <ThreeDMModal
        open={openSize3D}
        fileUrl={activeSize3DUrl}
        fileName={activeSize3DName}
        onClose={() => {
          setOpenSize3D(false);
          setActiveSize3DUrl(null);
          setActiveSize3DName("");
        }}
      />
    </>
  );
}
