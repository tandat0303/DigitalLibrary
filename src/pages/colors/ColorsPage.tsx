import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Form, Checkbox } from "antd";
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
import ConfirmRemoveModal from "../../components/ui/ConfirmRemoveModal";
import DataTableSection from "../../components/DataTableSection";

export default function ColorsPage() {
  const [form] = Form.useForm();

  const [dynamicCount, setDynamicCount] = useState(0);

  const [data, setData] = useState<ColorsDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const selectedRow = data.find((r) => r.ColorID === selectedID) ?? null;

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
    setSelectedID(null);

    setFilters(buildQueryFilters(values));
    setCurrent(1);
  };

  const handleSelectColor = (record: ColorsDataType) => {
    setSelectedID((prev) => (prev === record.ColorID ? null : record.ColorID));
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

      const res = await colorApi.deleteColor(selectedRow.ColorID);

      if (res.success) {
        setSelectedID(null);
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

    ConfirmRemoveModal({ topic: "color", onOk: handleDelete });
  };

  const handleImportExcel = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      SwalLoading("Uploading Excel file...");

      const res = await colorApi.importExcelFile(formData);

      Swal.close();

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
        setSelectedID(null);

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
        setSelectedID(null);

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
                    <Search size={13} />
                    Search
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

      <DataTableSection<ColorsDataType>
        dataSource={data}
        columns={columns}
        rowKey="ColorID"
        loading={loading}
        selectedRowKey={selectedID ?? undefined}
        onRowClick={handleSelectColor}
        total={total}
        current={current}
        pageSize={pageSize}
        onPageChange={setCurrent}
        onPageSizeChange={setPageSize}
        actionBar={{
          totalLabel: `${total} colors`,
          buttons: [
            {
              label: "NEW COLOR",
              tooltip: "Create new color",
              className: "add-btn",
              onClick: handleCreate,
            },
            {
              label: "EDIT COLOR",
              tooltip: "Update color information",
              className: "edit-btn",
              onClick: handleEdit,
            },
            {
              label: "REMOVE COLOR",
              tooltip: "Delete color",
              className: "delete-btn",
              onClick: confirmRemove,
            },
            {
              label: <Upload />,
              tooltip: "Import Excel file",
              className: "actions-btn",
              onClick: () => setOpenImport(true),
            },
          ],
        }}
      />

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
        slotImageWidth={1.3}
        emptyImage={EmptyImg}
      />
    </>
  );
}
