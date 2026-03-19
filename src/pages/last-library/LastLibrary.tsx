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
  Checkbox,
  Modal,
} from "antd";
import CustomPagination from "../../components/CustomPagination";
import { AppAlert } from "../../components/ui/AppAlert";

import AddFilter from "../../components/AddFilter";
import { FILTER_OPTIONS } from "../../components/ui/LastLibraryFilterOption";
import { Download, QrCode, Search, Upload } from "lucide-react";
import { TbFile3D, TbCube3dSphere } from "react-icons/tb";
import FilterCollapse from "../../components/FilterCollapse";
import { SafeTooltip } from "../../components/ui/Tooltip";
import {
  getLastLibraryColumns,
  type LastLibraryDataType,
} from "../../types/lastLibrary";
import UploadAttachModal from "../../components/UploadAttachModal";
import ThreeDMModal from "../../components/ThreeDMModal";
import LastLibraryModal from "./LastLibraryModal";
import { getApiErrorMessage } from "../../lib/getApiErrorMsg";
import { buildQueryFilters } from "../../lib/buildQueryFilters";
import { lastLibraryApi } from "../../api/lastLibrary.api";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function LastLibrary() {
  const [form] = Form.useForm();

  // const user = useAppSelector((state) => state.auth.user);

  const [dynamicCount, setDynamicCount] = useState(0);

  const [data, setData] = useState<LastLibraryDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LastLibraryDataType | null>(
    null,
  );

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  // const [openImport, setOpenImport] = useState(false);
  const [openUploadAttach, setOpenUploadAttach] = useState(false);

  // const [previewImages, setPreviewImages] = useState<(Image | File)[]>([]);
  // const [openPreview, setOpenPreview] = useState(false);

  // const [openCapture, setOpenCapture] = useState(false);

  const [open3D, setOpen3D] = useState(false);
  const [active3DFile, setActive3DFile] = useState<File | null>(null);

  // const handlePreview = (images: (File | Image)[]) => {
  //   setPreviewImages(images);
  //   setOpenPreview(true);
  // };

  // const handleDetailView = (record: NewLibraryDataType) => {
  //   window.open(`/last-library/show-info/${record.ID}`, "_blank");
  // };

  const columns = getLastLibraryColumns((file) => {
    setActive3DFile(file);
    setOpen3D(true);
  });

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const fetchItems = async () => {
    try {
      setLoading(true);

      const params = { ...filters, page: current, limit: pageSize };

      const res = await lastLibraryApi.getAllItems(params);

      const rows = res.data.map((item: any) => ({
        ...item,
        key: item.ID,
      }));

      setData(rows);
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
    const newFilters = buildQueryFilters(values);

    setFilters(newFilters);
    setCurrent(1);
  };

  const handleSelectItem = (record: LastLibraryDataType) => {
    if (selectedRow?.LastLibraryID === record.LastLibraryID) {
      setSelectedRow(null);
      return;
    }

    setSelectedRow(record);
  };

  // const handleExportExcel = async () => {
  //   try {
  //     const params = { ...filters };

  //     SwalLoading("Exporting Excel file...");

  //     const start = Date.now();

  //     const response = await newLibraryApi.exportExcel(params);

  //     const url = window.URL.createObjectURL(new Blob([response]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     const fileName = `Materials (Last Library) Data_${new Date()
  //       .toISOString()
  //       .slice(0, 10)}.xlsx`;
  //     link.setAttribute("download", fileName);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.parentNode?.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     const elapsed = Date.now() - start;
  //     if (elapsed < 1000) {
  //       await sleep(1000 - elapsed);
  //     }

  //     Swal.close();

  //     SwalNotification("success", "Export successfully");
  //   } catch (error) {
  //     Swal.close();

  //     SwalNotification("error", getApiErrorMessage(error));
  //   }
  // };

  // const handleExportExcelQR = async () => {
  //   if (Object.keys(filters).length === 0) {
  //     AppAlert({ icon: "warning", title: "Please choose filter" });
  //     return;
  //   }

  //   try {
  //     const params = { ...filters };

  //     SwalLoading("Exporting QR Excel file...");

  //     const start = Date.now();

  //     const response = await newLibraryApi.exportExcelQR(params);

  //     const url = window.URL.createObjectURL(new Blob([response]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     const fileName = `Materials (Last Library) QR Data_${new Date().toISOString().slice(0, 10)}.xlsx`;
  //     link.setAttribute("download", fileName);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.parentNode?.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     const elapsed = Date.now() - start;
  //     if (elapsed < 1000) {
  //       await sleep(1000 - elapsed);
  //     }

  //     Swal.close();

  //     SwalNotification("success", "Export successfully");
  //   } catch (error) {
  //     Swal.close();

  //     SwalNotification("error", getApiErrorMessage(error));
  //   }
  // };

  // const handleCameraSearch = (response: any) => {
  //   try {
  //     if (!response?.results?.length) {
  //       AppAlert({ icon: "warning", title: "No search results found" });
  //       return;
  //     }

  //     const topResult = response.results.find(
  //       (item: any) => item.advanced_rank === 1,
  //     );

  //     if (!topResult) {
  //       AppAlert({ icon: "warning", title: "No result with rank 1" });
  //       return;
  //     }

  //     const formattedCluster = topResult.cluster.replace(/_/g, "//");

  //     // AppAlert({
  //     //   icon: "success",
  //     //   title: `Detected: ${formattedCluster}`,
  //     // });

  //     form.setFieldsValue({
  //       Classification: formattedCluster,
  //     });

  //     const newFilters = buildQueryFilters({
  //       Classification: formattedCluster,
  //     });

  //     setFilters(newFilters);
  //     setCurrent(1);

  //     setOpenCapture(false);
  //   } catch (error) {
  //     console.error(error);
  //     AppAlert({ icon: "error", title: "Failed to process search result" });
  //   }
  // };

  const handleUploadAttach = async (file: File) => {
    // if (!selectedRow || !user) return;
    if (!selectedRow) return;

    setData((prev) =>
      prev.map((item) =>
        item.LastLibraryID === selectedRow.LastLibraryID
          ? { ...item, Test_3D: file }
          : item,
      ),
    );

    setSelectedRow(null);

    // try {
    //   const formData = new FormData();

    //   formData.append("fileId", selectedRow.ID);
    //   formData.append("user", user.userid);
    //   formData.append("file", file);

    //   await newLibraryApi.attachFile(formData);

    //   AppAlert({ icon: "success", title: "Success" });

    //   await fetchMaterials();
    // } catch (error) {
    //   console.error(error);
    //   AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    // }
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

      const res = await lastLibraryApi.deleteItem(selectedRow.LastLibraryID);

      if (res.success) {
        setSelectedRow(null);
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

    Modal.confirm({
      title: "REMOVE MATERIAL",
      content: "Are you sure to remove this item?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      onOk: () => handleDelete(),
    });
  };

  // const handleImportExcel = async (file: File) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     SwalLoading("Uploading Excel file...");

  //     const res = await newLibraryApi.importExcelFile(formData);

  //     Swal.close();

  //     if (res.success) {
  //       SwalNotification("success", res.message);

  //       await fetchMaterials();
  //     }
  //   } catch (error) {
  //     Swal.close();

  //     SwalNotification("error", getApiErrorMessage(error));
  //   }
  // };

  const handleSubmit = async () => {
    if (mode === "create") {
      const values = form.getFieldsValue();

      try {
        await lastLibraryApi.createItem(values);

        AppAlert({ icon: "success", title: "Added new item successfully" });

        setOpenModal(false);
        setSelectedRow(null);
        await fetchItems();
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    } else {
      try {
        if (!selectedRow) return;

        const values = form.getFieldsValue();

        await lastLibraryApi.updateItem(selectedRow.LastLibraryID, values);
        AppAlert({ icon: "success", title: "Item updated successfully" });
        setOpenModal(false);
        setSelectedRow(null);
        await fetchItems();
      } catch (error) {
        console.log(error);
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    }
  };

  const handle3DViewer = () => {
    if (!selectedRow?.Test_3D) return;

    if (selectedRow.Test_3D instanceof File) {
      setActive3DFile(selectedRow.Test_3D);
    }
    setOpen3D(true);
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
            // onValuesChange={(changedValues, allValues) => {
            //   if ("hasImage" in changedValues) {
            //     setFilters((prev: any) => {
            //       const newFilters = { ...prev };

            //       if (allValues.hasImage) {
            //         newFilters.hasImage = false;
            //       } else {
            //         delete newFilters.hasImage;
            //       }

            //       return newFilters;
            //     });

            //     setCurrent(1);
            //   }
            // }}
            actions={
              <>
                <Form.Item>
                  <Button className="btn-custom" htmlType="submit">
                    <Search size={13} />
                    Search
                  </Button>
                </Form.Item>
                <Form.Item name="hasImage" valuePropName="checked">
                  <Checkbox>No Image</Checkbox>
                </Form.Item>
              </>
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
                <SafeTooltip title={"Create new item"}>
                  <Button
                    className="add-btn w-full lg:w-auto"
                    onClick={handleCreate}
                  >
                    NEW ITEM
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Update item information"}>
                  <Button
                    className="edit-btn w-full lg:w-auto"
                    // disabled={!selectedRow}
                    onClick={handleEdit}
                  >
                    EDIT ITEM
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Delete item"}>
                  <Button
                    className="delete-btn w-full lg:w-auto"
                    // disabled={!selectedRow}
                    onClick={confirmRemove}
                  >
                    REMOVE ITEM
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Import Excel file"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    // icon={<Upload className="h-5" />}
                    // onClick={() => setOpenImport(true)}
                  >
                    <Upload />
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Export Excel file"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    // icon={<Download className="h-5" />}
                    // onClick={handleExportExcel}
                  >
                    <Download />
                  </Button>
                </SafeTooltip>

                <SafeTooltip title={"Export QR Excel file"}>
                  <Button
                    className="actions-btn w-full lg:w-auto"
                    // onClick={handleExportExcelQR}
                    // icon={<QrCode className="h-5" />}
                  >
                    <QrCode />
                  </Button>
                </SafeTooltip>

                {/* <SafeTooltip title={"Scan material image"}>
                  <Button
                    className="extra-actions-btn w-full lg:w-auto"
                    // onClick={() => setOpenCapture(true)}
                  >
                    Detail Material
                  </Button>
                </SafeTooltip> */}

                <SafeTooltip title={"Upload 3D Modal file"}>
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
                    <TbFile3D className="w-4 h-4" />
                    Attach 3DM file
                  </Button>
                </SafeTooltip>

                {selectedRow && selectedRow.Test_3D && (
                  <SafeTooltip title={"Show 3D Modal"}>
                    <Button
                      className="extra-actions-btn w-full lg:w-auto"
                      onClick={handle3DViewer}
                    >
                      <TbCube3dSphere className="h-4 w-4" />
                      3D Viewer
                    </Button>
                  </SafeTooltip>
                )}
              </Space>

              <span className="adidas-font text-left lg:text-right">
                {total} items
              </span>
            </div>

            <div className="w-full mt-1">
              <Table
                loading={loading}
                bordered
                columns={columns}
                dataSource={data}
                rowKey="key"
                pagination={false}
                scroll={{ x: "max-content" }}
                onRow={(record) => ({
                  onClick: () => {
                    handleSelectItem(record);
                  },
                })}
                rowClassName={(record) =>
                  record.LastLibraryID &&
                  record.LastLibraryID === selectedRow?.LastLibraryID
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

      <LastLibraryModal
        open={openModal}
        mode={mode}
        initialValues={mode === "edit" ? selectedRow : undefined}
        onCancel={() => setOpenModal(false)}
        onSubmit={handleSubmit}
      />

      {/* <ImportExcelModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        sampleFileName="Ex_File_New_Library"
        onImport={(file) => {
          if (!file) return;
          handleImportExcel(file);
          setOpenImport(false);
        }}
      /> */}

      <UploadAttachModal
        open={openUploadAttach}
        onClose={() => setOpenUploadAttach(false)}
        onImport={(file) => {
          if (!file || !selectedRow) return;
          handleUploadAttach(file);
          setOpenUploadAttach(false);
        }}
      />

      {/* <ImagePreviewModal
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
      /> */}

      <ThreeDMModal
        open={open3D}
        file={active3DFile}
        onClose={() => {
          setOpen3D(false);
          setActive3DFile(null);
        }}
      />
    </>
  );
}
