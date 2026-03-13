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
import { FILTER_OPTIONS } from "../../components/ui/MaterialsFilterOption";
import { Download, QrCode, Search, Upload } from "lucide-react";
import ImportExcelModal from "../../components/ImportExcelModal";
import FilterCollapse from "../../components/FilterCollapse";
import {
  getHighAbrasionColumns,
  type HighAbrasionDataType,
} from "../../types/highAbrasion";
import UploadAttachModal from "../../components/UploadAttachModal";
import { IMAGE_FIELD_MAP, IMAGE_LABELS, sleep } from "../../lib/helpers";
import ImagePreviewModal from "../../components/ImagePreviewModal";
import EmptyImg from "@/assets/nodata.png";
import CameraModal from "../../components/CameraModal";
import type { Image } from "../../types/images";
import { buildQueryFilters } from "../../lib/buildQueryFilters";
import { getApiErrorMessage } from "../../lib/getApiErrorMsg";
import { SwalLoading } from "../../components/ui/SwalLoading";
import { SwalNotification } from "../../components/ui/SwalNotification";
import Swal from "sweetalert2";
import { useAppSelector } from "../../hooks/auth";
import highAbrasionApi from "../../api/highAbrasion.api";
import HighAbrasionModal from "./HighAbrasionModal";
import { SafeTooltip } from "../../components/ui/Tooltip";

export default function HighAbrasion() {
  const [form] = Form.useForm();

  const user = useAppSelector((state) => state.auth.user);

  const [dynamicCount, setDynamicCount] = useState(0);

  const [data, setData] = useState<HighAbrasionDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<HighAbrasionDataType | null>(
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

  const handleDetailView = (record: HighAbrasionDataType) => {
    window.open(`/high-abrasion/show-info/${record.ID}`, "_blank");
  };

  const columns = getHighAbrasionColumns(handlePreview, handleDetailView);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const fetchMaterials = async () => {
    try {
      setLoading(true);

      const params = { ...filters, page: current, limit: pageSize };

      const res = await highAbrasionApi.getAllMaterials(params);

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

  const handleSelectMaterial = (record: HighAbrasionDataType) => {
    if (selectedRow?.ID === record.ID) {
      setSelectedRow(null);
      return;
    }

    setSelectedRow(record);
  };

  const handleExportExcel = async () => {
    try {
      const params = { ...filters };

      SwalLoading("Exporting Excel file...");

      const start = Date.now();

      const response = await highAbrasionApi.exportExcel(params);

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `Materials (High Abrasion) Data_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await sleep(1000 - elapsed);
      }

      Swal.close();

      SwalNotification("success", "Export successfully");
    } catch (error) {
      Swal.close();

      SwalNotification("error", getApiErrorMessage(error));
    }
  };

  const handleExportExcelQR = async () => {
    if (Object.keys(filters).length === 0) {
      AppAlert({ icon: "warning", title: "Please choose filter" });
      return;
    }

    try {
      const params = { ...filters };

      SwalLoading("Exporting QR Excel file...");

      const start = Date.now();

      const response = await highAbrasionApi.exportExcelQR(params);

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `Materials (High Abrasion) QR Data_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      const elapsed = Date.now() - start;
      if (elapsed < 1000) {
        await sleep(1000 - elapsed);
      }

      Swal.close();

      SwalNotification("success", "Export successfully");
    } catch (error) {
      Swal.close();

      SwalNotification("error", getApiErrorMessage(error));
    }
  };

  const handleCameraSearch = (response: any) => {
    try {
      if (!response?.results?.length) {
        AppAlert({ icon: "warning", title: "No search results found" });
        return;
      }

      const topResult = response.results.find(
        (item: any) => item.advanced_rank === 1,
      );

      if (!topResult) {
        AppAlert({ icon: "warning", title: "No result with rank 1" });
        return;
      }

      const formattedCluster = topResult.cluster.replace(/_/g, "//");

      // AppAlert({
      //   icon: "success",
      //   title: `Detected: ${formattedCluster}`,
      // });

      form.setFieldsValue({
        Classification: formattedCluster,
      });

      const newFilters = buildQueryFilters({
        Classification: formattedCluster,
      });

      setFilters(newFilters);
      setCurrent(1);

      setOpenCapture(false);
    } catch (error) {
      console.error(error);
      AppAlert({ icon: "error", title: "Failed to process search result" });
    }
  };

  const handleUploadAttach = async (file: File) => {
    if (!selectedRow || !user) return;

    try {
      const formData = new FormData();

      formData.append("fileId", selectedRow.ID);
      formData.append("user", user.userid);
      formData.append("file", file);

      await highAbrasionApi.attachFile(formData);

      AppAlert({ icon: "success", title: "Success" });

      await fetchMaterials();
    } catch (error) {
      console.error(error);
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
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

      const res = await highAbrasionApi.deleteMaterial(selectedRow.ID);

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

      const res = await highAbrasionApi.importExcelFile(formData);

      Swal.close();

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

        const images = values.Images ?? [];

        images.forEach((img: any, index: number) => {
          if (!(img instanceof File)) return;

          const label = IMAGE_LABELS[index];
          const fieldName = IMAGE_FIELD_MAP[label];

          if (fieldName) {
            formData.append(fieldName, img);
          }
        });

        await highAbrasionApi.createMaterial(formData);

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

        const images = values.Images ?? [];

        images.forEach((img: any, index: number) => {
          if (!(img instanceof File)) return;

          const label = IMAGE_LABELS[index];
          const fieldName = IMAGE_FIELD_MAP[label];

          if (fieldName) {
            formData.append(fieldName, img);
          }
        });

        await highAbrasionApi.updateMaterial(selectedRow.ID, formData);

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

  const handleDownloadReport = () => {
    if (!selectedRow?.FilePath || !selectedRow?.FileName) return;

    const link = document.createElement("a");
    link.href = selectedRow.FilePath;
    link.download = selectedRow.FileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <SafeTooltip title={"Create new material"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    onClick={handleCreate}
                  >
                    NEW MATERIAL
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Update material information"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    // disabled={!selectedRow}
                    onClick={handleEdit}
                  >
                    EDIT MATERIAL
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Delete material"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    // disabled={!selectedRow}
                    onClick={confirmRemove}
                  >
                    REMOVE MATERIAL
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Import Excel file"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    // icon={<Upload className="h-5" />}
                    onClick={() => setOpenImport(true)}
                  >
                    <Upload />
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Export Excel file"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    // icon={<Download className="h-5" />}
                    onClick={handleExportExcel}
                  >
                    <Download />
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Export QR Excel file"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    onClick={handleExportExcelQR}
                    // icon={<QrCode className="h-5" />}
                  >
                    <QrCode />
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Scan material image"}>
                  <Button
                    className="extra-actions-btn w-full lg:w-auto"
                    onClick={() => setOpenCapture(true)}
                  >
                    Detail Material
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Upload attach file"}>
                  <Button
                    className="extra-actions-btn w-full lg:w-auto"
                    // disabled={!selectedRow}
                    onClick={() => {
                      if (!selectedRow) {
                        AppAlert({
                          icon: "warning",
                          title: "Please choose a row data",
                        });
                        return;
                      }

                      setOpenUploadAttach(true);
                    }}
                  >
                    Attach File
                  </Button>
                </SafeTooltip>

                {selectedRow && selectedRow.FileName && (
                  <SafeTooltip title={"Download attach file"}>
                    <Button
                      className="extra-actions-btn w-full lg:w-auto"
                      onClick={handleDownloadReport}
                    >
                      <Download className="h-4 w-4" />
                      Download Report
                    </Button>
                  </SafeTooltip>
                )}
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

      <HighAbrasionModal
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
          handleUploadAttach(file);
          setOpenUploadAttach(false);
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
        labels={["Top side", "Bottom side"]}
        previewSize={500}
      />

      <CameraModal
        open={openCapture}
        onClose={() => setOpenCapture(false)}
        onCapture={handleCameraSearch}
      />
    </>
  );
}
