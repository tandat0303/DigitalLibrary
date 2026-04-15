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

  // const [sizeLocalMap, setSizeLocalMap] = useState<
  //   Record<string, { url: string; name: string }>
  // >({});

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const columns = getLastLibraryColumns();
  // sizeLocalMap,
  // (sizeKey, url, fileName) => {
  //   setSizeLocalMap((prev) => ({
  //     ...prev,
  //     [sizeKey]: { url, name: fileName },
  //   }));
  // },
  // (url, name) => {
  //   setActiveSize3DUrl(url);
  //   setActiveSize3DName(name);
  //   setOpenSize3D(true);
  // },

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page: current, limit: pageSize };
      const res = await lastLibraryApi.getAllItems(params);
      const data: LastLibraryDataType[] = res.data;
      setRawData(data);
      setFlatData(flattenLastLibraryData(data));
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
    setSelectedID(null);

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

      setSelectedID(null);
      AppAlert({ icon: "success", title: res.message });

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
