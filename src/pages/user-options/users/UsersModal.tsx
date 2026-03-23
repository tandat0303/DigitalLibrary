import { Button, Col, Form, Grid, Input, Modal, Row, Select } from "antd";
import type { UsersModalProps } from "../../../types/users";
import { useEffect, useState } from "react";
import { AppAlert } from "../../../components/ui/AppAlert";
import { requiredMessage } from "../../../lib/helpers";
// import { requiredMessage } from "../../../lib/helpers";

export default function UsersModal({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: UsersModalProps) {
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
    } catch {
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
      width={isMobile ? "100%" : isTablet ? 500 : 800}
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
            <div
              style={{
                maxHeight: isMobile ? "40vh" : 400,
                overflowY: isMobile ? "auto" : "hidden",
                overflowX: "hidden",
                width: "100%",
              }}
            >
              <Row gutter={[24, 1]} style={{ margin: 0 }}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Name"
                    name="FullName"
                    // rules={[{ required: true, message: requiredMessage }]}
                  >
                    <Input placeholder="Enter your name" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email"
                    name="Email"
                    rules={[
                      // { required: true, message: requiredMessage },
                      { type: "email", message: "Invalid email" },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Factory"
                    name="Factory"
                    // rules={[{ required: true, message: requiredMessage }]}
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

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Level Permission"
                    name="LevelPermission"
                    // rules={[{ required: true, message: requiredMessage }]}
                  >
                    <Select
                      placeholder="--- Choose option ---"
                      options={[
                        { label: "Supervisor", value: "ADMIN" },
                        { label: "User", value: "USER" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Account"
                    name="Username"
                    rules={
                      mode === "create"
                        ? [{ required: true, message: requiredMessage }]
                        : []
                    }
                  >
                    <Input
                      disabled={mode === "edit"}
                      placeholder="Enter your account"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Password"
                    name="Password"
                    rules={[
                      // mode === "create"
                      //   ? [{ required: true, message: requiredMessage }]
                      //   : []
                      {
                        min: 4,
                        message: "Password must be at least 4 characters",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter your password" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="Vendor Code (option)" name="VendorCode">
                    <Input placeholder="Enter your vendor code" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
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
