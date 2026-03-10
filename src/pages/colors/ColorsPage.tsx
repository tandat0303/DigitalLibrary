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
import { buildQueryFilters } from "../../lib/buildQueryFilters";
import Swal from "sweetalert2";
import { SwalLoading } from "../../components/ui/SwalLoading";
import { SwalNotification } from "../../components/ui/SwalNotification";
import { sleep } from "../../lib/helpers";

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

  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});
  // const [sorter, setSorter] = useState<{
  //   sort: string;
  //   order: SortOrder;
  // }>({
  //   sort: "ColorName",
  //   order: "DESC",
  // });

  const fetchColors = async () => {
    try {
      setLoading(true);

      const params = {
        ...filters,
        page: current,
        limit: pageSize,
        // sort: sorter.sort,
        // order: sorter.order,
      };

      const res = await colorApi.getAllColors(params);

      const rows = res.data.map((item) => ({
        ...item,
        key: item.ColorID,
      }));

      setData(rows);
      setTotal(res.total);
    } catch (error) {
      console.log("Failed to fetch color: ", error);
      AppAlert({ icon: "error", title: "Failed to fetch color" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, [current, pageSize, filters]);

  const handleFilter = (values: any) => {
    const newFilters = buildQueryFilters(values);

    setFilters(newFilters);
    setCurrent(1);
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
    if (!selectedRow) {
      AppAlert({ icon: "warning", title: "Please choose a row data" });
      return;
    }

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

  const handleImportExcel = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      SwalLoading("Uploading Excel file...");

      await sleep(700);

      const res = await colorApi.importExcelFile(formData);

      if (res.success) {
        SwalNotification("success", res.message);

        await fetchColors();
      }
    } catch (error) {
      Swal.close();

      SwalNotification("error", getApiErrorMessage(error));
    }
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
          (img: any): img is File => img instanceof File,
        );

        newImages.forEach((file: any) => {
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
            onValuesChange={(changedValues, allValues) => {
              if ("hasImage" in changedValues) {
                setFilters((prev: any) => {
                  const newFilters = { ...prev };

                  if (allValues.hasImage) {
                    newFilters.hasImage = false;
                  } else {
                    delete newFilters.hasImage;
                  }

                  return newFilters;
                });

                setCurrent(1);
              }
            }}
            // initialValues={{ hasImage: false }}
            actions={
              <>
                <Form.Item>
                  <Button className="btn-custom" htmlType="submit">
                    Search
                    <Search />
                  </Button>
                </Form.Item>
                {/* <Button onClick={() => form.resetFields()}>
                          Reset
                        </Button> */}
                <Form.Item name="hasImage" valuePropName="checked">
                  <Checkbox>No Image</Checkbox>
                </Form.Item>
              </>
            }
          >
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="ColorName" label="Color Name">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="ColorGroup" label="Color Group">
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
                  // disabled={!selectedRow}
                  onClick={handleEdit}
                >
                  EDIT COLOR
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  // disabled={!selectedRow}
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
                dataSource={data}
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
                // onChange={(sorter: any) => {
                //   if (sorter?.field) {
                //     setSorter({
                //       sort: sorter.field,
                //       order: sorter.order === "ascend" ? "ASC" : "DESC",
                //     });
                //   }
                // }}
              />
            </div>

            <CustomPagination
              total={total}
              current={current}
              pageSize={pageSize}
              onChange={(page) => setCurrent(page)}
              onPageSizeChange={(size) => setPageSize(size)}
            />
          </Card>
        </Col>
      </Row>

      <ImportExcelModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        sampleFileName="Sample_File_Color"
        onImport={(file) => {
          if (!file) return;
          handleImportExcel(file);
          setOpenImport(false);
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
