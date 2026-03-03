import { Card, Form, Input, Button, Row, Col, Select, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { requiredMessage } from "../../../lib/helpers";

const { Title, Text } = Typography;

export default function UserInfo() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
    <Card
      style={{
        maxWidth: 800,
        margin: "0 auto",
        borderRadius: 8,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>
          User details
        </Title>
        <Text type="secondary">Update your personal details here.</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          userAccount: "admin",
          name: "Administrators",
          email: "admin@lacty.com.vn",
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="User Account"
              name="userAccount"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
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
            textAlign: "right",
          }}
        >
          <Button
            type="primary"
            loading={loading}
            onClick={handleSave}
            className="save-button"
          >
            Save
          </Button>
        </div>
      </Form>
    </Card>
  );
}
