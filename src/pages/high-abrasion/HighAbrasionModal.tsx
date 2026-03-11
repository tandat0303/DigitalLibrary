import { Button, Col, Form, Grid, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { AppAlert } from "../../components/ui/AppAlert";
import ImageUploader from "../../components/ImageUploader";
// import { requiredMessage } from "../../lib/helpers";
import type { Image } from "../../types/images";
import { getApiErrorMessage } from "../../lib/getApiErrorMsg";
import { IMAGE_LABELS, mapImagesToLabels } from "../../lib/helpers";
import type { HighAbrasionModalProps } from "../../types/highAbrasion";
import highAbrasionApi from "../../api/highAbrasion.api";

export default function HighAbrasionModal({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: HighAbrasionModalProps) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const formValues = Form.useWatch([], form);

  const isFormEmpty =
    mode === "create" &&
    (!formValues ||
      Object.values(formValues).every(
        (v) => v === undefined || v === null || v === "",
      ));

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        Images: mapImagesToLabels(initialValues.Images, IMAGE_LABELS, 2),
      });
    } else {
      form.resetFields();
    }
  }, [open, mode, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      await onSubmit(values);

      form.resetFields();
    } catch (error) {
      console.log(error);
      AppAlert({ icon: "error", title: "Please fill all fields" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    form.resetFields();
    onCancel();
  };

  const handleDeleteExistingImage = async (image: Image) => {
    try {
      const res = await highAbrasionApi.deleteMaterialImage(image.ImageID);

      if (res.success) {
        AppAlert({ icon: "success", title: res.message });
      }
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      throw error;
    }
  };

  return (
    <Modal
      title={mode === "create" ? "New Material" : "Edit Material"}
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={isMobile ? "100%" : isTablet ? 900 : 1200}
      style={{
        top: isMobile ? 0 : undefined,
        height: isMobile ? "85vh" : "auto",
      }}
      mask={{ closable: !loading }}
      centered
    >
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          paddingTop: 16,
        }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={24}>
              <div
                style={{
                  maxHeight: isMobile ? "40vh" : 300,
                  overflowY: "auto",
                  overflowX: "hidden",
                  width: "100%",
                  paddingRight: 8,
                }}
              >
                <Row gutter={[24, 1]}>
                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Material ID"
                      name="Material_ID"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Material ID" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Vendor Code"
                      name="Vendor_Code"
                      // rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter your Vendor Code" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Supplier"
                      name="Supplier"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Supplier" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Supplier material ID"
                      name="Supplier_Material_ID"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Supplier material ID" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Supplier Material Name"
                      name="Supplier_Material_Name"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Supplier Material Name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Mtl - Supp Lifecycle State"
                      name="Mtl_Supp_Lifecycle_State"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Mtl - Supp Lifecycle State" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Material Type Level 1"
                      name="Material_Type_Level_1"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Material Type Level 1" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Composition"
                      name="Composition"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Composition" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Classification"
                      name="Classification"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Classification" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Material Thickness"
                      name="Material_Thickness"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Material Thickness" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Comparison UOM"
                      name="Comparison_UOM"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Comparison UOM" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Price Remark"
                      name="Price_Remark"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Price Remark" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Skin Size"
                      name="Skin_Size"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Skin Size" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="QC%"
                      name="QC_Percent"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your QC%" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Leadtime"
                      name="Leadtime"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Leadtime" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Sample Leadtime"
                      name="Sample_Leadtime"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Sample Leadtime" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Min Qty/ Color"
                      name="Min_Qty_Color"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Min Qty/ Color" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Min Qty/ Sample"
                      name="Min_Qty_Sample"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Min Qty/ Sample" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Production Location"
                      name="Production_Location"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Production Location" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Terms of Delivery per T1 Country"
                      name="Terms_of_Delivery_per_T1_Country"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Terms of Delivery per T1 Country" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Valid From (Price)"
                      name="Valid_From_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Valid From (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Valid To (Price)"
                      name="Valid_To_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Valid To (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Price Type"
                      name="Price_Type"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Price Type" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Color Code (Price)"
                      name="Color_Code_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Color Code (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Color (Price)"
                      name="Color_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Color (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Treatment (Price)"
                      name="Treatment_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Treatment (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Width (Price)"
                      name="Width_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Width (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Width Uom (Price)"
                      name="Width_Uom_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Width Uom (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Length (Price)"
                      name="Length_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Length (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Length Uom (Price)"
                      name="Length_Uom_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Length Uom (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Thickness (Price)"
                      name="Thickness_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Thickness (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Thickness Uom (Price)"
                      name="Thickness_Uom_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Thickness Uom (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Diameter Inside (Price)"
                      name="Diameter_Inside_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Diameter Inside (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Diameter Inside Uom (Price)"
                      name="Diameter_Inside_Uom_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Diameter Inside Uom (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Weight (Price)"
                      name="Weight_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Weight (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Weight Uom (Price)"
                      name="Weight_Uom_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Weight Uom (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Quantity (Price)"
                      name="Quantity_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Quantity (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Quantity Uom (Price)"
                      name="Quantity_Uom_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Quantity Uom (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Uom String (Price)"
                      name="Uom_String_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Uom String (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="SS26 Final Price (USD)"
                      name="SS26_Final_Price_USD"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your SS26 Final Price (USD)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Comparison Price (Price) (USD)"
                      name="Comparison_Price_Price_USD"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Comparison Price (Price) (USD)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Approved as Final Price Y/N (Price)"
                      name="Approved_As_Final_Price_Y_N_Price"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Approved as Final Price Y/N (Price)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Season"
                      name="Season"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Season" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col span={24} className="mt-1">
              <Form.Item
                name="Images"
                valuePropName="value"
                getValueFromEvent={(v) => v}
              >
                <ImageUploader
                  max={2}
                  accept={["image/jpeg", "image/png"]}
                  width={380}
                  height={240}
                  labels={IMAGE_LABELS}
                  onDeleteExisting={
                    mode === "edit" ? handleDeleteExistingImage : undefined
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            paddingTop: 16,
            textAlign: "right",
          }}
        >
          <Button
            className="cancel-modal-btn"
            onClick={handleClose}
            disabled={loading}
            style={{
              background: "#8c8c8c",
              color: "#fff",
              marginRight: 8,
            }}
          >
            Close
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={mode === "create" && isFormEmpty}
            style={{
              background: "#1f1f1f",
              borderColor: "#1f1f1f",
            }}
            className="save-modal-btn"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
