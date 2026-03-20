import { Button, Col, Form, Grid, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { AppAlert } from "../../components/ui/AppAlert";
// import ImageUploader from "../../components/ImageUploader";
// import { requiredMessage } from "../../lib/helpers";
// import type { Image } from "../../types/images";
// import { getApiErrorMessage } from "../../lib/getApiErrorMsg";
// import { IMAGE_LABELS, mapImagesToLabels } from "../../lib/helpers";
import type { LastLibraryModalProps } from "../../types/lastLibrary";
// import newLibraryApi from "../../api/newLibrary.api";

export default function LastLibraryModal({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: LastLibraryModalProps) {
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
        // Images: mapImagesToLabels(initialValues.Images, IMAGE_LABELS, 2),
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

  // const handleDeleteExistingImage = async (image: Image) => {
  //   try {
  //     const res = await newLibraryApi.deleteMaterialImage(image.ImageID);

  //     if (res.success) {
  //       AppAlert({ icon: "success", title: res.message });
  //     }
  //   } catch (error) {
  //     AppAlert({ icon: "error", title: getApiErrorMessage(error) });
  //     throw error;
  //   }
  // };

  return (
    <Modal
      title={mode === "create" ? "New Item" : "Edit Item"}
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
                      label="Season (M)"
                      name="Season_M"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Season (M)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Creation Workflow (M)"
                      name="Creation_Workflow_M"
                      // rules={[{ required: true }]}
                    >
                      <Input placeholder="Enter your Creation Workflow (M)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Model Number (M)"
                      name="Model_Number_M"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Model Number (M)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Article Number (A)"
                      name="Article_Number_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Article Number (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Model Name Short (M)"
                      name="Model_Name_Short_M"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Model Name Short (M)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Sports Category (M)"
                      name="Sports_Category_M"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Sports Category (M)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Development Type (A)"
                      name="Development_Type_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Development Type (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Group Name (A)"
                      name="Group_Name_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Group Name (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Development Factory (M)"
                      name="Development_Factory_M"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Development Factory (M)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Digital Scope (A)"
                      name="Digital_Scope_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Digital Scope (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Digital Scope Update Date (A)"
                      name="Digital_Scope_Update_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Digital Scope Update Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Marketing Department (A)"
                      name="Marketing_Department_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Marketing Department (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Preview Final Rendering available Downstream Date (A)"
                      name="Preview_Final_Rendering_available_Downstream_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Preview Final Rendering available Downstream Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Pre-sell Final Rendering available Downstream Date (A)"
                      name="Presell_Final_Rendering_available_Downstream_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Pre-sell Final Rendering available Downstream Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="SMS Final Rendering available Downstream Date (A)"
                      name="SMS_Final_Rendering_available_Downstream_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your SMS Final Rendering available Downstream Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="MCS Final rendering available Downstream Date (A)"
                      name="MCS_Final_rendering_available_Downstream_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your MCS Final rendering available Downstream Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Article Status (A)"
                      name="Article_Status_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Article Status (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Carry Over Season (A)"
                      name="Carry_Over_Season_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Carry Over Season (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Consumer Testing (A)"
                      name="Consumer_Testing_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Consumer Testing (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Image Launch Date (A)"
                      name="Image_Launch_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Image Launch Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Developer (A)"
                      name="Developer_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Developer (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Senior Developer (A)"
                      name="Senior_Developer_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Senior Developer (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Drop Date (A)"
                      name="Drop_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Drop Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="3D Factory (A)"
                      name="Factory_3D_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your 3D Factory (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Tags (A)"
                      name="Tags_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Tags (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Preview Approval/Publish Date (A)"
                      name="Preview_Approval_Publish_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Preview Approval/Publish Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Pre-sell Approval/Publish Date (A)"
                      name="Presell_Approval_Publish_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Pre-sell Approval/Publish Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="SMS Approval/Publish Date (A)"
                      name="SMS_Approval_Publish_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your SMS Approval/Publish Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="MCS Approval/Publish Date (A)"
                      name="MCS_Approval_Publish_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your MCS Approval/Publish Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Published by (A)"
                      name="Published_by_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Published by (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Published Milestone Timestamp (A)"
                      name="Published_Milestone_Timestamp_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Published Milestone Timestamp (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Published Milestone (A)"
                      name="Published_Milestone_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Published Milestone (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Expected Milestone (A)"
                      name="Expected_Milestone_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Expected Milestone (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="HQ Render Status Timestamp (A)"
                      name="HQ_Render_Status_Timestamp_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your HQ Render Status Timestamp (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="HQ Render Status (A)"
                      name="HQ_Render_Status_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your HQ Render Status (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Design Sketch Latest Update (A)"
                      name="Design_Sketch_Latest_Update_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Design Sketch Latest Update (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Feasibility Checked Date (A)"
                      name="Feasibility_Checked_Date_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Feasibility Checked Date (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Image Confidential (A)"
                      name="Image_Confidential_A"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Image Confidential (A)" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={6}>
                    <Form.Item
                      label="Last (M)"
                      name="Last_M"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your Last (M)" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* <Col span={24} className="mt-1">
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
            </Col> */}
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
            {loading ? "Saving" : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
