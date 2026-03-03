import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import type { UsersModalProps } from "../../../types/users";
import { useEffect, useState } from "react";
import { AppAlert } from "../../../components/ui/AppAlert";
import { requiredMessage } from "../../../lib/helpers";

export default function UsersModal({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: UsersModalProps) {
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
      title={mode === "create" ? "New User" : "Edit User"}
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={800}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: requiredMessage },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Factory"
                name="factory"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Select
                  placeholder="--- Choose option ---"
                  options={[
                    { label: "LYV", value: "LYV" },
                    { label: "LVL", value: "LVL" },
                    { label: "LHG", value: "LHG" },
                    { label: "LYM", value: "LYM" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Level Permission"
                name="levelPermission"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Select
                  placeholder="--- Choose option ---"
                  options={[
                    { label: "Supervisor", value: "Supervisor" },
                    { label: "User", value: "User" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Account"
                name="userAccount"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Input disabled={mode === "edit"} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={
                  mode === "create"
                    ? [{ required: true, message: requiredMessage }]
                    : []
                }
              >
                <Input.Password />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Vendor Code (option)" name="vendorCode">
                <Input />
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
