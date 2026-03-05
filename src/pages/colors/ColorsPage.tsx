import { useEffect, useState } from "react";
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
import { FILTER_OPTIONS } from "../../components/ui/ColorsFilterOption";
import ImportExcelModal from "../../components/ImportExcelModal";
import ColorsModal from "./ColorsModal";
import FilterCollapse from "../../components/FilterCollapse";
import { Search, Upload } from "lucide-react";
import { getColorsColumns, type ColorsDataType } from "../../types/colors";
import ImagePreviewModal from "../../components/ImagePreviewModal";
import EmptyImg from "@/assets/nodata.png";
import colorApi from "../../api/colors.api";
import { getApiErrorMessage } from "../../lib/getApiErrorMsg";
import type { Image } from "../../types/images";

export default function ColorsPage() {
  const [form] = Form.useForm();

  const [dynamicCount, setDynamicCount] = useState(0);

  const [data, setData] = useState<ColorsDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ColorsDataType | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [openImport, setOpenImport] = useState(false);

  const [previewImages, setPreviewImages] = useState<(Image | File)[]>([]);
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

  const fetchColors = async () => {
    try {
      setLoading(true);

      const res = await colorApi.getAllColors();

      setData(
        res.map((item: ColorsDataType) => ({
          ...item,
          key: item.ColorID,
        })),
      );
    } catch (error) {
      console.log("Failed to fetch error: ", error);
      AppAlert({ icon: "error", title: "Failed to fetch color" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleFilter = (values: any) => {
    console.log("Filter values:", values);
  };

  const handleSelectColor = (record: ColorsDataType) => {
    if (selectedRow?.ColorID === record.ColorID) {
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

  const handleDelete = async () => {
    try {
      if (!selectedRow) return;

      const res = await colorApi.deleteColor(selectedRow.ColorID);

      if (res.success) {
        setSelectedRow(null);
        AppAlert({ icon: "success", title: res.message });
      }

      await fetchColors();
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
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
      try {
        const formData = new FormData();

        formData.append("colorName", values.ColorName);
        formData.append("colorCode", values.ColorCode);
        formData.append("rgbValue", values.RGBValue);
        formData.append("cmykValue", values.CMYKValue);
        formData.append("colorGroup", values.ColorGroup);

        // formData.append(
        //   "colorStatus",
        //   values.ColorStatus ? "true" : "false"
        // );

        if (values.Images?.length) {
          values.Images.forEach((file: File) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        }

        await colorApi.createColor(formData);

        AppAlert({ icon: "success", title: "Added new color successfully" });

        setOpenModal(false);
        setSelectedRow(null);

        await fetchColors();
      } catch (error) {
        AppAlert({
          icon: "error",
          title: getApiErrorMessage(error),
        });
      }
    } else {
      try {
        if (!selectedRow) return;

        const formData = new FormData();

        formData.append("colorName", values.ColorName);
        formData.append("colorCode", values.ColorCode);
        formData.append("rgbValue", values.RGBValue);
        formData.append("cmykValue", values.CMYKValue);
        formData.append("colorGroup", values.ColorGroup);

        if (values.ColorStatus !== undefined) {
          formData.append("colorStatus", values.ColorStatus ? "true" : "false");
        }

        const images = (values.Images ?? []).filter(Boolean);

        const newImages = images.filter(
          (img): img is File => img instanceof File,
        );

        newImages.forEach((file) => {
          formData.append("images", file);
        });

        await colorApi.updateColor(selectedRow.ColorID, formData);

        AppAlert({
          icon: "success",
          title: "Color updated successfully",
        });

        setOpenModal(false);
        setSelectedRow(null);

        await fetchColors();
      } catch (error) {
        console.log(error);
        AppAlert({
          icon: "error",
          title: getApiErrorMessage(error),
        });
      }
    }
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
                // colSpan={4}
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
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="Color_Name" label="Color Name">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
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
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
              <Space
                wrap
                className="w-full [&>*]:w-full lg:w-auto lg:[&>*]:w-auto"
              >
                <Button
                  className="actions-btn w-full lg:w-auto"
                  onClick={handleCreate}
                >
                  NEW COLOR
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  disabled={!selectedRow}
                  onClick={handleEdit}
                >
                  EDIT COLOR
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  disabled={!selectedRow}
                  onClick={confirmRemove}
                >
                  REMOVE COLOR
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  // icon={<Upload className="h-5" />}
                  onClick={() => setOpenImport(true)}
                >
                  <Upload />
                </Button>
              </Space>

              <span className="adidas-font text-left lg:text-right">
                {total} colors
              </span>
            </div>

            <div className="w-full mt-1">
              <Table
                loading={loading}
                bordered
                scroll={{ x: "max-content" }}
                sticky
                columns={columns}
                dataSource={paginatedData}
                rowKey="ColorID"
                pagination={false}
                onRow={(record) => ({
                  onClick: () => {
                    handleSelectColor(record);
                  },
                })}
                rowClassName={(record) =>
                  record.ColorID && record.ColorID === selectedRow?.ColorID
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
