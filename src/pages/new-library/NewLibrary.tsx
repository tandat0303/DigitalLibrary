import { useState } from "react";
import {
  Card,
  Input,
  Button,
  Table,
  Space,
  Row,
  Col,
  Form,
  Modal,
  Checkbox,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CustomPagination from "../../components/CustomPagination";
import { AppAlert } from "../../components/ui/AppAlert";

import AddFilter from "../../components/AddFilter";
import { FILTER_OPTIONS } from "../../components/ui/MaterialsFilterOption";
import { Download, QrCode, Search, Upload } from "lucide-react";
import ImportExcelModal from "../../components/ImportExcelModal";
import FilterCollapse from "../../components/FilterCollapse";
import { initialMaterialsData } from "../../types/samples";
import {
  getMaterialsColumns,
  type MaterialsDataType,
} from "../../types/materials";
import UploadAttachModal from "../../components/UploadAttachModal";
import { sleep } from "../../lib/helpers";
import MaterialModal from "../materials/tabs/material/MaterialModal";
import ImagePreviewModal from "../../components/ImagePreviewModal";
import EmptyImg from "@/assets/nodata.png";
import CameraModal from "../../components/CameraModal";
import { exportToExcel } from "../../lib/exportExcel";

export default function NewLibrary() {
  const [form] = Form.useForm();

  const [dynamicCount, setDynamicCount] = useState(0);

  const [data, setData] = useState(initialMaterialsData);
  const [selectedRow, setSelectedRow] = useState<MaterialsDataType | null>(
    null,
  );

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [openImport, setOpenImport] = useState(false);
  const [openUploadAttach, setOpenUploadAttach] = useState(false);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [openPreview, setOpenPreview] = useState(false);

  const [openCapture, setOpenCapture] = useState(false);

  const handlePreview = (images: string[]) => {
    setPreviewImages(images);
    setOpenPreview(true);
  };

  const handleDetailView = (record: MaterialsDataType) => {
    const key = `material-${record.Unique_Price_ID}`;

    sessionStorage.setItem(key, JSON.stringify(record));

    window.open(`/show-info/${record.Unique_Price_ID}`, "_blank");
  };

  const columns = getMaterialsColumns(handlePreview, handleDetailView);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = data.length;

  const paginatedData = data.slice(
    (current - 1) * pageSize,
    current * pageSize,
  );

  const handleFilter = (values: any) => {
    console.log("Filter values:", values);
  };

  const handleSelectMaterial = (record: MaterialsDataType) => {
    if (selectedRow?.Unique_Price_ID === record.Unique_Price_ID) {
      setSelectedRow(null);
      return;
    }

    setSelectedRow(record);
  };

  const handleExportExcel = () => {
    const exportData = data.map((row) => {
      const obj: Record<string, unknown> = {};

      columns.forEach((col: any) => {
        if (!col.dataIndex) return;

        const key = col.dataIndex as keyof MaterialsDataType;
        obj[String(col.title)] = row[key];
      });

      return obj;
    });

    exportToExcel(exportData, "materials");
  };

  const handleCreate = () => {
    setMode("create");
    setSelectedRow(null);
    setOpenModal(true);
  };

  const handleEdit = () => {
    if (!selectedRow) return;
    setMode("edit");
    setOpenModal(true);
  };

  const handleDelete = () => {
    if (!selectedRow) return;

    setData((prev) =>
      prev.filter(
        (item) => item.Unique_Price_ID !== selectedRow.Unique_Price_ID,
      ),
    );

    setSelectedRow(null);

    AppAlert({ icon: "success", title: "Color removed successfully" });
  };

  const confirmRemove = () => {
    Modal.confirm({
      title: "REMOVE COLOR",
      content: "Are you sure to remove this color?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      onOk: () => handleDelete(),
    });
  };

  const handleSubmit = async (values: any) => {
    if (mode === "create") {
      if (!values.Unique_Price_ID) return;

      const newRecord = {
        ...values,
        Unique_Price_ID: crypto.randomUUID(),
        key: crypto.randomUUID(),
      };
      setData((prev) => [...prev, newRecord]);
      AppAlert({ icon: "success", title: "Added new material successfully" });
    } else {
      setData((prev) =>
        prev.map((item) =>
          item.Unique_Price_ID === selectedRow?.Unique_Price_ID
            ? {
                ...values,
                Unique_Price_ID: selectedRow.Unique_Price_ID,
                key: selectedRow.Unique_Price_ID,
              }
            : item,
        ),
      );

      AppAlert({ icon: "success", title: "Material updated successfully" });
    }

    await sleep(500);
    setOpenModal(false);
    setSelectedRow(null);
  };

  return (
    <>
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
                colSpan={4}
                onChangeActiveCount={setDynamicCount}
              />
            }
            visibleFilterCount={3 + dynamicCount}
            actions={
              <>
                <Button className="btn-custom" htmlType="submit">
                  Search <Search />
                </Button>
                <Checkbox>No Image</Checkbox>
              </>
            }
          >
            <Col span={4}>
              <Form.Item name="Material_ID" label="Material ID">
                <Input />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item name="Vendor_Code" label="Vendor Code">
                <Input />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item name="Classification" label="Classification">
                <Input />
              </Form.Item>
            </Col>
          </FilterCollapse>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Card
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            styles={{
              body: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <div className="flex justify-between">
              <Space style={{ marginBottom: 12 }}>
                <Button className="actions-btn" onClick={handleCreate}>
                  NEW MATERIAL
                </Button>

                <Button
                  className="actions-btn"
                  disabled={!selectedRow}
                  onClick={handleEdit}
                >
                  EDIT MATERIAL
                </Button>

                <Button
                  className="actions-btn"
                  disabled={!selectedRow}
                  onClick={confirmRemove}
                >
                  REMOVE MATERIAL
                </Button>

                <Button
                  className="actions-btn"
                  icon={<Upload className="h-5" />}
                  onClick={() => setOpenImport(true)}
                />

                <Button
                  className="actions-btn"
                  icon={<Download className="h-5" />}
                  onClick={handleExportExcel}
                />

                <Button
                  className="actions-btn"
                  icon={<QrCode className="h-5" />}
                />

                <Button
                  className="extra-actions-btn"
                  onClick={() => setOpenCapture(true)}
                >
                  Detail Material
                </Button>
                <Button
                  className="extra-actions-btn"
                  disabled={!selectedRow}
                  onClick={() => setOpenUploadAttach(true)}
                >
                  Add File
                </Button>
              </Space>

              <span>98873 materials</span>
            </div>

            <div style={{ flex: 1 }}>
              <Table
                bordered
                columns={columns}
                dataSource={paginatedData}
                rowKey="Unique_Price_ID"
                pagination={false}
                scroll={{ x: "max-content" }}
                onRow={(record) => ({
                  onClick: () => {
                    handleSelectMaterial(record);
                  },
                })}
                rowClassName={(record) =>
                  record.Unique_Price_ID &&
                  record.Unique_Price_ID === selectedRow?.Unique_Price_ID
                    ? "custom-selected-row"
                    : ""
                }
              />
            </div>

            <CustomPagination
              total={total}
              current={current}
              pageSize={pageSize}
              onChange={setCurrent}
              onPageSizeChange={setPageSize}
            />
          </Card>
        </Col>
      </Row>

      <MaterialModal
        open={openModal}
        mode={mode}
        initialValues={mode === "edit" ? selectedRow : undefined}
        onCancel={() => setOpenModal(false)}
        onSubmit={handleSubmit}
      />

      <ImportExcelModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onImport={(file) => {
          console.log("Import file: ", file);
          setOpenImport(false);
          AppAlert({ icon: "success", title: "Imported successfully" });
        }}
      />

      <UploadAttachModal
        open={openUploadAttach}
        onClose={() => setOpenUploadAttach(false)}
        onImport={(file) => {
          if (!file || !selectedRow) return;

          setData((prev) =>
            prev.map((item) =>
              item.Unique_Price_ID === selectedRow.Unique_Price_ID
                ? { ...item, File_Name: file.name }
                : item,
            ),
          );

          setOpenUploadAttach(false);

          AppAlert({
            icon: "success",
            title: "File attached successfully",
          });
        }}
      />

      <ImagePreviewModal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        images={previewImages}
        columns={2}
        maxImages={2}
        imageSize={400}
        emptyImage={EmptyImg}
        labels={["Topside", "Bottomside"]}
      />

      <CameraModal
        open={openCapture}
        onClose={() => setOpenCapture(false)}
        onCapture={(img) => console.log("Captured: ", img)}
      />
    </>
  );
}
