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
import CustomPagination from "../../../../components/CustomPagination";
import { AppAlert } from "../../../../components/ui/AppAlert";

import AddFilter from "../../../../components/AddFilter";
import { FILTER_OPTIONS } from "../../../../components/ui/MaterialsFilterOption";
import { Download, QrCode, Search, Upload } from "lucide-react";
import ImportExcelModal from "../../../../components/ImportExcelModal";
import FilterCollapse from "../../../../components/FilterCollapse";
import {
  getMaterialsColumns,
  type MaterialsDataType,
} from "../../../../types/materials";
import UploadAttachModal from "../../../../components/UploadAttachModal";
import { sleep } from "../../../../lib/helpers";
import MaterialModal from "./MaterialModal";
import ImagePreviewModal from "../../../../components/ImagePreviewModal";
import EmptyImg from "@/assets/nodata.png";
import CameraModal from "../../../../components/CameraModal";
import { exportToExcel } from "../../../../lib/exportExcel";
import type { Image } from "../../../../types/images";
import { buildQueryFilters } from "../../../../lib/buildQueryFilters";
import materialApi from "../../../../api/materials.api";
import { getApiErrorMessage } from "../../../../lib/getApiErrorMsg";
import { SwalLoading } from "../../../../components/ui/SwalLoading";
import { SwalNotification } from "../../../../components/ui/SwalNotification";
import Swal from "sweetalert2";

export default function MaterialsContent() {
  const [form] = Form.useForm();

  const [dynamicCount, setDynamicCount] = useState(0);

  const [data, setData] = useState<MaterialsDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MaterialsDataType | null>(
    null,
  );

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [openImport, setOpenImport] = useState(false);
  const [openUploadAttach, setOpenUploadAttach] = useState(false);

  const [previewImages, setPreviewImages] = useState<(Image | File)[]>([]);
  const [openPreview, setOpenPreview] = useState(false);

  const [openCapture, setOpenCapture] = useState(false);

  const handlePreview = (images: (File | Image)[]) => {
    setPreviewImages(images);
    setOpenPreview(true);
  };

  const handleDetailView = (record: MaterialsDataType) => {
    const key = `material-${record.ID}`;

    sessionStorage.setItem(key, JSON.stringify(record));

    window.open(`/show-info/${record.ID}`, "_blank");
  };

  const columns = getMaterialsColumns(handlePreview, handleDetailView);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const fetchMaterials = async () => {
    try {
      setLoading(false);

      const params = { ...filters, page: current, limit: pageSize };

      const res = await materialApi.getAllMaterials(params);

      const rows = res.data.map((item) => ({
        ...item,
        key: item.ID,
      }));

      setData(rows);
      setTotal(res.total);
    } catch (error) {
      console.log("Failed to fetch material: ", error);
      AppAlert({ icon: "error", title: "Failed to fetch material" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [current, pageSize, filters]);

  const handleFilter = (values: any) => {
    const newFilters = buildQueryFilters(values);

    setFilters(newFilters);
    setCurrent(1);
  };

  const handleSelectMaterial = (record: MaterialsDataType) => {
    if (selectedRow?.ID === record.ID) {
      setSelectedRow(null);
      return;
    }

    setSelectedRow(record);
  };

  const handleExportExcel = () => {
    const exportColumns = columns.filter(
      (col: any) =>
        col.dataIndex &&
        col.dataIndex !== "Images" &&
        col.dataIndex !== "File_Name",
    );

    const exportData = data.map((row) => {
      const obj: Record<string, unknown> = {};

      exportColumns.forEach((col: any) => {
        const key = col.dataIndex as keyof MaterialsDataType;
        obj[String(col.title)] = row[key];
      });

      return obj;
    });

    exportToExcel(
      exportData,
      exportColumns.map((c: any) => c.title),
      "Materials Data",
    );
  };

  const handleUploadAttach = () => {
    if (!selectedRow) {
      AppAlert({ icon: "warning", title: "Please choose a row data" });
      return;
    }

    setOpenUploadAttach(true);
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

      const res = await materialApi.deleteMaterial(selectedRow.ID);

      if (res.success) {
        setSelectedRow(null);
        AppAlert({ icon: "success", title: res.message });
      }

      await fetchMaterials();
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
      title: "REMOVE MATERIAL",
      content: "Are you sure to remove this material?",
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

      await sleep(1000);

      const res = await materialApi.importExcelFile(formData);

      if (res.success) {
        SwalNotification("success", res.message);

        await fetchMaterials();
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

        formData.append("materialID", values.Material_ID);
        formData.append("vendorCode", values.Vendor_Code);
        formData.append("supplier", values.Supplier);
        formData.append("supplierMaterialID", values.Supplier_Material_ID);
        formData.append("supplierMaterialName", values.Supplier_Material_Name);
        formData.append(
          "mtlSuppLifecycleState",
          values.Mtl_Supp_Lifecycle_State,
        );
        formData.append("materialTypeLevel1", values.Material_Type_Level_1);
        formData.append("composition", values.Composition);
        formData.append("classification", values.Classification);
        formData.append("materialThickness", values.Material_Thickness);
        formData.append("materialThicknessUOM", values.Material_Thickness_UOM);
        formData.append("comparisonUOM", values.Comparison_UOM);
        formData.append("priceRemark", values.Price_Remark);
        formData.append("skinSize", values.Skin_Size);
        formData.append("qCPercent", values.QC_Percent);
        formData.append("leadtime", values.Leadtime);
        formData.append("sampleLeadtime", values.Sample_Leadtime);
        formData.append("minQtyColor", values.Min_Qty_Color);
        formData.append("minQtySample", values.Min_Qty_Sample);
        formData.append("productionLocation", values.Production_Location);
        formData.append(
          "termsofDeliveryperT1Country",
          values.Terms_of_Delivery_per_T1_Country,
        );
        formData.append("validFromPrice", values.Valid_From_Price);
        formData.append("validToPrice", values.Valid_To_Price);
        formData.append("priceType", values.Price_Type);
        formData.append("colorCodePrice", values.Color_Code_Price);
        formData.append("colorPrice", values.Color_Price);
        formData.append("treatmentPrice", values.Treatment_Price);
        formData.append("widthPrice", values.Width_Price);
        formData.append("widthUomPrice", values.Width_Uom_Price);
        formData.append("lengthPrice", values.Length_Price);
        formData.append("lengthUomPrice", values.Length_Uom_Price);
        formData.append("thicknessPrice", values.Thickness_Price);
        formData.append("thicknessUomPrice", values.Thickness_Uom_Price);
        formData.append("diameterInsidePrice", values.Diameter_Inside_Price);
        formData.append(
          "diameterInsideUomPrice",
          values.Diameter_Inside_Uom_Price,
        );
        formData.append("weightPrice", values.Weight_Price);
        formData.append("weightUomPrice", values.Weight_Uom_Price);
        formData.append("quantityPrice", values.Quantity_Price);
        formData.append("quantityUomPrice", values.Quantity_Uom_Price);
        formData.append("uomStringPrice", values.Uom_String_Price);
        formData.append("sS26FinalPriceUSD", values.SS26_Final_Price_USD);
        formData.append(
          "comparisonPricePriceUSD",
          values.Comparison_Price_Price_USD,
        );
        formData.append(
          "approvedAsFinalPriceYNPrice",
          values.Approved_As_Final_Price_Y_N_Price,
        );
        formData.append("season", values.Season);

        if (values.Images?.length) {
          values.Images.forEach((file: File) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        }

        await materialApi.createMaterial(formData);

        AppAlert({ icon: "success", title: "Added new material successfully" });

        setOpenModal(false);
        setSelectedRow(null);

        await fetchMaterials();
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    } else {
      try {
        if (!selectedRow) return;

        const formData = new FormData();

        formData.append("materialID", values.Material_ID);
        formData.append("vendorCode", values.Vendor_Code);
        formData.append("supplier", values.Supplier);
        formData.append("supplierMaterialID", values.Supplier_Material_ID);
        formData.append("supplierMaterialName", values.Supplier_Material_Name);
        formData.append(
          "mtlSuppLifecycleState",
          values.Mtl_Supp_Lifecycle_State,
        );
        formData.append("materialTypeLevel1", values.Material_Type_Level_1);
        formData.append("composition", values.Composition);
        formData.append("classification", values.Classification);
        formData.append("materialThickness", values.Material_Thickness);
        formData.append("materialThicknessUOM", values.Material_Thickness_UOM);
        formData.append("comparisonUOM", values.Comparison_UOM);
        formData.append("priceRemark", values.Price_Remark);
        formData.append("skinSize", values.Skin_Size);
        formData.append("qCPercent", values.QC_Percent);
        formData.append("leadtime", values.Leadtime);
        formData.append("sampleLeadtime", values.Sample_Leadtime);
        formData.append("minQtyColor", values.Min_Qty_Color);
        formData.append("minQtySample", values.Min_Qty_Sample);
        formData.append("productionLocation", values.Production_Location);
        formData.append(
          "termsofDeliveryperT1Country",
          values.Terms_of_Delivery_per_T1_Country,
        );
        formData.append("validFromPrice", values.Valid_From_Price);
        formData.append("validToPrice", values.Valid_To_Price);
        formData.append("priceType", values.Price_Type);
        formData.append("colorCodePrice", values.Color_Code_Price);
        formData.append("colorPrice", values.Color_Price);
        formData.append("treatmentPrice", values.Treatment_Price);
        formData.append("widthPrice", values.Width_Price);
        formData.append("widthUomPrice", values.Width_Uom_Price);
        formData.append("lengthPrice", values.Length_Price);
        formData.append("lengthUomPrice", values.Length_Uom_Price);
        formData.append("thicknessPrice", values.Thickness_Price);
        formData.append("thicknessUomPrice", values.Thickness_Uom_Price);
        formData.append("diameterInsidePrice", values.Diameter_Inside_Price);
        formData.append(
          "diameterInsideUomPrice",
          values.Diameter_Inside_Uom_Price,
        );
        formData.append("weightPrice", values.Weight_Price);
        formData.append("weightUomPrice", values.Weight_Uom_Price);
        formData.append("quantityPrice", values.Quantity_Price);
        formData.append("quantityUomPrice", values.Quantity_Uom_Price);
        formData.append("uomStringPrice", values.Uom_String_Price);
        formData.append("sS26FinalPriceUSD", values.SS26_Final_Price_USD);
        formData.append(
          "comparisonPricePriceUSD",
          values.Comparison_Price_Price_USD,
        );
        formData.append(
          "approvedAsFinalPriceYNPrice",
          values.Approved_As_Final_Price_Y_N_Price,
        );
        formData.append("season", values.Season);

        const images = (values.Images ?? []).filter(Boolean);

        const newImages = images.filter(
          (img): img is File => img instanceof File,
        );

        newImages.forEach((file) => {
          formData.append("images", file);
        });

        await materialApi.updateMaterial(selectedRow.ID, formData);

        AppAlert({ icon: "success", title: "Material updated successfully" });

        setOpenModal(false);
        setSelectedRow(null);

        await fetchMaterials();
      } catch (error) {
        console.log(error);
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
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
            visibleFilterCount={3 + dynamicCount}
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
            actions={
              <>
                <Form.Item>
                  <Button className="btn-custom" htmlType="submit">
                    Search
                    <Search />
                  </Button>
                </Form.Item>
                <Form.Item name="hasImage" valuePropName="checked">
                  <Checkbox>No Image</Checkbox>
                </Form.Item>
              </>
            }
          >
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="Material_ID" label="Material ID">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Form.Item name="Vendor_Code" label="Vendor Code">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
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
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
              <Space
                wrap
                className="w-full [&>*]:w-full lg:w-auto lg:[&>*]:w-auto"
              >
                <Button
                  className="actions-btn w-full lg:w-auto"
                  onClick={handleCreate}
                >
                  NEW MATERIAL
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  // disabled={!selectedRow}
                  onClick={handleEdit}
                >
                  EDIT MATERIAL
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  // disabled={!selectedRow}
                  onClick={confirmRemove}
                >
                  REMOVE MATERIAL
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  // icon={<Upload className="h-5" />}
                  onClick={() => setOpenImport(true)}
                >
                  <Upload />
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  // icon={<Download className="h-5" />}
                  onClick={handleExportExcel}
                >
                  <Download />
                </Button>

                <Button
                  className="actions-btn w-full lg:w-auto"
                  // icon={<QrCode className="h-5" />}
                >
                  <QrCode />
                </Button>

                <Button
                  className="extra-actions-btn w-full lg:w-auto"
                  onClick={() => setOpenCapture(true)}
                >
                  Detail Material
                </Button>
                <Button
                  className="extra-actions-btn w-full lg:w-auto"
                  // disabled={!selectedRow}
                  onClick={handleUploadAttach}
                >
                  Add File
                </Button>
              </Space>

              <span className="adidas-font text-left lg:text-right">
                {total} materials
              </span>
            </div>

            <div className="w-full mt-1">
              <Table
                loading={loading}
                bordered
                columns={columns}
                dataSource={data}
                rowKey="ID"
                pagination={false}
                scroll={{ x: "max-content" }}
                onRow={(record) => ({
                  onClick: () => {
                    handleSelectMaterial(record);
                  },
                })}
                rowClassName={(record) =>
                  record.ID && record.ID === selectedRow?.ID
                    ? "custom-selected-row"
                    : ""
                }
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
        sampleFileName="Ex_File_Material"
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

          setData((prev) =>
            prev.map((item) =>
              item.ID === selectedRow.ID
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
        previewSize={500}
      />

      <CameraModal
        open={openCapture}
        onClose={() => setOpenCapture(false)}
        onCapture={(img) => console.log("Captured: ", img)}
      />
    </>
  );
}
