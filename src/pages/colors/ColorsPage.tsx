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
import { initialColorsData } from "../../types/samples";
import CustomPagination from "../../components/CustomPagination";
import { AppAlert } from "../../components/ui/AppAlert";

import AddFilter from "../../components/AddFilter";
import { FILTER_OPTIONS } from "../../components/ui/ColorsFilterOption";
import ImportExcelModal from "../../components/ImportExcelModal";
import ColorsModal from "./ColorsModal";
import { sleep } from "../../lib/helpers";
import FilterCollapse from "../../components/FilterCollapse";
import { Search, Upload } from "lucide-react";
import { getColorsColumns, type ColorsDataType } from "../../types/colors";
import ImagePreviewModal from "../../components/ImagePreviewModal";
import EmptyImg from "@/assets/nodata.png";

export default function ColorsPage() {
  const [form] = Form.useForm();

  const [dynamicCount, setDynamicCount] = useState(0);

  const [data, setData] = useState(initialColorsData);
  const [selectedRow, setSelectedRow] = useState<ColorsDataType | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [openImport, setOpenImport] = useState(false);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [openPreview, setOpenPreview] = useState(false);

  const columns = getColorsColumns((images) => {
    setPreviewImages(images);
    setOpenPreview(true);
  });

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

  const handleSelectColor = (record: ColorsDataType) => {
    if (selectedRow?.Color_Code === record.Color_Code) {
      setSelectedRow(null);
      return;
    }

    setSelectedRow(record);
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
      prev.filter((item) => item.Color_Code !== selectedRow.Color_Code),
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
      if (!values.Color_Code) return;

      setData((prev) => [
        ...prev,
        {
          ...values,
          key: values.Color_Code,
        },
      ]);

      AppAlert({ icon: "success", title: "Added new color successfully" });
    } else {
      setData((prev) =>
        prev.map((item) =>
          item.Color_Code === selectedRow?.Color_Code ? values : item,
        ),
      );

      AppAlert({ icon: "success", title: "Color updated successfully" });
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
            visibleFilterCount={2 + dynamicCount}
            actions={
              <>
                <Button className="btn-custom" htmlType="submit">
                  Search
                  <Search />
                </Button>
                {/* <Button onClick={() => form.resetFields()}>
                          Reset
                        </Button> */}
                <Checkbox>No Image</Checkbox>
              </>
            }
          >
            <Col span={4}>
              <Form.Item name="Color_Name" label="Color Name">
                <Input />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item name="Color_Group" label="Color Group">
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
                  NEW COLOR
                </Button>

                <Button
                  className="actions-btn"
                  disabled={!selectedRow}
                  onClick={handleEdit}
                >
                  EDIT COLOR
                </Button>

                <Button
                  className="actions-btn"
                  disabled={!selectedRow}
                  onClick={confirmRemove}
                >
                  REMOVE COLOR
                </Button>

                <Button
                  className="actions-btn"
                  icon={<Upload className="h-5" />}
                  onClick={() => setOpenImport(true)}
                />
              </Space>

              <span className="adidas-font">5184 colors</span>
            </div>

            <div style={{ flex: 1 }}>
              <Table
                bordered
                columns={columns}
                dataSource={paginatedData}
                rowKey="Color_Code"
                pagination={false}
                onRow={(record) => ({
                  onClick: () => {
                    handleSelectColor(record);
                  },
                })}
                rowClassName={(record) =>
                  record.Color_Code &&
                  record.Color_Code === selectedRow?.Color_Code
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

      <ImportExcelModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onImport={(file) => {
          console.log("Import file: ", file);
          setOpenImport(false);
          AppAlert({ icon: "success", title: "Imported successfully" });
        }}
      />

      <ColorsModal
        open={openModal}
        mode={mode}
        initialValues={mode === "edit" ? selectedRow : undefined}
        onCancel={() => setOpenModal(false)}
        onSubmit={handleSubmit}
      />

      <ImagePreviewModal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        images={previewImages}
        columns={3}
        maxImages={6}
        imageSize={250}
        emptyImage={EmptyImg}
      />
    </>
  );
}
