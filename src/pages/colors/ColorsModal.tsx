import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { AppAlert } from "../../components/ui/AppAlert";
import type { ColorsModalProps } from "../../types/colors";
import ImageUploader from "../../components/ImageUploader";
import { requiredMessage } from "../../lib/helpers";

export default function ColorsModal({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: ColorsModalProps) {
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
    } catch (error: any) {
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

  return (
    <Modal
      title={mode === "create" ? "New Color" : "Edit Color"}
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={1000}
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
            <Col span={8}>
              <Form.Item
                label="Color Name"
                name="Color_Name"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Input placeholder="Enter your color name" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Color Code"
                name="Color_Code"
                rules={[{ required: true }]}
              >
                <Input
                  disabled={mode === "edit"}
                  placeholder="Enter your color code"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="RGB Value"
                name="RGB_Value"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Input placeholder="Enter your rgb value" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="CMYK Value"
                name="CMYK_Value"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Input placeholder="Enter your cmyk value" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Color Group"
                name="Color_Group"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Input placeholder="Enter your color group" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Color Status"
                name="Color_Status"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Select
                  placeholder="--- Choose option ---"
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Disabled", value: "Disable" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Reference" name="ColorsImg">
                <ImageUploader
                  max={6}
                  accept={["image/jpeg", "image/png"]}
                  width={380}
                  height={240}
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
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
