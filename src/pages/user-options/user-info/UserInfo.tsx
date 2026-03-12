import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  Grid,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { requiredMessage } from "../../../lib/helpers";
import { useAppSelector } from "../../../hooks/auth";

const { Title, Text } = Typography;

export default function UserInfo() {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("Saved values:", values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          maxWidth: 800,
          borderRadius: 8,
          width: "100%",
        }}
        styles={{
          body: {
            padding: isMobile ? 16 : 24,
          },
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={isMobile ? 4 : 2} style={{ marginBottom: 4 }}>
            User details
          </Title>
          <Text type="secondary">Update your personal details here.</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            userAccount: user?.username,
            name: user?.fullname,
            email: user?.email,
          }}
        >
          <Row gutter={isMobile ? 12 : 16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="User Account"
                name="userAccount"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Factory"
                name="factory"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Select
                  placeholder="Select factory"
                  options={[
                    { label: "LYV", value: "LYV" },
                    { label: "LVL", value: "LVL" },
                    { label: "LHG", value: "LHG" },
                    { label: "LYM", value: "LYM" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: requiredMessage }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
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

            <Col xs={24} md={12}>
              <Form.Item label="Change Password" name="password">
                <Input.Password
                  placeholder="Enter new password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              marginTop: 24,
              textAlign: isMobile ? "center" : "right",
            }}
          >
            <Button
              type="primary"
              loading={loading}
              onClick={handleSave}
              className="save-button"
              style={{
                width: isMobile ? "100%" : undefined,
                // maxWidth: isMobile ? 300 : undefined,
              }}
            >
              {loading ? "Saving" : "Save"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
