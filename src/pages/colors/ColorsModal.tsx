import { Button, Col, Form, Grid, Input, Modal, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { AppAlert } from "../../components/ui/AppAlert";
import type { ColorsModalProps } from "../../types/colors";
import ImageUploader from "../../components/ImageUploader";
import { requiredMessage } from "../../lib/helpers";
import type { Image } from "../../types/images";
import colorApi from "../../api/colors.api";
import { getApiErrorMessage } from "../../lib/getApiErrorMsg";

export default function ColorsModal({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: ColorsModalProps) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValues) {
      form.setFieldsValue(initialValues);
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
      const res = await colorApi.deleteColorImage(image.ImageID);

      if (res.success) {
        AppAlert({
          icon: "success",
          title: res.message,
        });
      }
    } catch (error) {
      AppAlert({
        icon: "error",
        title: getApiErrorMessage(error),
      });

      throw error;
    }
  };

  return (
    <Modal
      title={mode === "create" ? "New Color" : "Edit Color"}
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={isMobile ? "100%" : isTablet ? 700 : 1000}
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
                  overflowY: isMobile ? "auto" : "hidden",
                  overflowX: "hidden",
                  width: "100%",
                }}
              >
                <Row gutter={[24, 1]}>
                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      label="Color Name"
                      name="ColorName"
                      rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your color name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      label="Color Code"
                      name="ColorCode"
                      rules={[{ required: true }]}
                    >
                      <Input
                        disabled={mode === "edit"}
                        placeholder="Enter your color code"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      label="RGB Value"
                      name="RGBValue"
                      rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your rgb value" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      label="CMYK Value"
                      name="CMYKValue"
                      rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your cmyk value" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      label="Color Group"
                      name="ColorGroup"
                      rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Input placeholder="Enter your color group" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                      label="Color Status"
                      name="ColorStatus"
                      // rules={[{ required: true, message: requiredMessage }]}
                    >
                      <Select
                        placeholder="--- Choose option ---"
                        options={[
                          { label: "Active", value: true },
                          { label: "Disabled", value: false },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col span={24}>
              <Form.Item label="Reference" name="Images">
                <ImageUploader
                  max={6}
                  accept={["image/jpeg", "image/png"]}
                  width={380}
                  height={240}
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
