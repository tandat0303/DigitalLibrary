import { Form, Input, Button, Row, Col, Select, Grid } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { requiredMessage } from "../../../lib/helpers";
import { useAppSelector } from "../../../hooks/auth";
import { Save, User, Mail, Lock, Building2, AtSign } from "lucide-react";

// function FieldWithIcon({
//   icon,
//   children,
// }: {
//   icon: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="field-wrapper">
//       <div className="field-icon">{icon}</div>
//       {children}
//     </div>
//   );
// }

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

  const initials = user?.fullname
    ? user.fullname
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="user-info-wrapper">
      <div className="user-info-card">
        {/* Header */}
        <div className="card-header">
          <div className="avatar-container">
            <div className="user-avatar">{initials}</div>
            <div className="avatar-badge" />
          </div>
          <div className="header-text-group">
            <div className="header-title">
              {user?.fullname || "User Profile"}
            </div>
            <div className="header-subtitle">
              Manage your account settings and preferences
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          <div className="section-label">Account Information</div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              userAccount: user?.username,
              name: user?.fullname,
              email: user?.email,
            }}
          >
            <Row gutter={isMobile ? 0 : 20}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="User Account"
                  name="userAccount"
                  className="ui-form-item"
                >
                  {/* <FieldWithIcon icon={<AtSign size={14} />}> */}
                  <Input
                    prefix={<AtSign />}
                    disabled
                    className="ui-input ui-input-disabled"
                  />
                  {/* </FieldWithIcon> */}
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Factory"
                  name="factory"
                  rules={[{ required: true, message: requiredMessage }]}
                  className="ui-form-item"
                >
                  <Select
                    prefix={<Building2 className="field-icon" />}
                    placeholder="Select factory"
                    className="ui-select ui-input"
                    style={{ width: "100%" }}
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
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: requiredMessage }]}
                  className="ui-form-item"
                >
                  {/* <FieldWithIcon icon={<User size={14} />}> */}
                  <Input
                    prefix={<User className="field-icon" />}
                    placeholder="Enter your full name"
                    className="ui-input"
                  />
                  {/* </FieldWithIcon> */}
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: requiredMessage },
                    { type: "email", message: "Invalid email address" },
                  ]}
                  className="ui-form-item"
                >
                  {/* <FieldWithIcon icon={<Mail size={14} />}> */}
                  <Input
                    prefix={<Mail className="field-icon" />}
                    placeholder="Enter your email"
                    className="ui-input"
                  />
                  {/* </FieldWithIcon> */}
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Change Password"
                  name="password"
                  className="ui-form-item"
                >
                  {/* <FieldWithIcon icon={<Lock size={14} />}> */}
                  <Input.Password
                    prefix={<Lock className="field-icon" />}
                    placeholder="Enter new password"
                    className="ui-input"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                  {/* </FieldWithIcon> */}
                </Form.Item>
              </Col>
            </Row>

            <div className="divider-line" />

            <div className="footer-row">
              <span className="footer-note">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <Button
                loading={loading}
                onClick={handleSave}
                className="save-button"
              >
                {!loading && <Save size={14} />}
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

// import {
//   Card,
//   Form,
//   Input,
//   Button,
//   Row,
//   Col,
//   Select,
//   Typography,
//   Grid,
// } from "antd";
// import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
// import { useState } from "react";
// import { requiredMessage } from "../../../lib/helpers";
// import { useAppSelector } from "../../../hooks/auth";
// import { Save } from "lucide-react";

// const { Title, Text } = Typography;

// export default function UserInfo() {
//   const { useBreakpoint } = Grid;
//   const screens = useBreakpoint();
//   const isMobile = !screens.md;

//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   const user = useAppSelector((state) => state.auth.user);

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       setLoading(true);

//       await new Promise((resolve) => setTimeout(resolve, 800));

//       console.log("Saved values:", values);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Card
//         style={{
//           maxWidth: 800,
//           borderRadius: 8,
//           width: "100%",
//         }}
//         styles={{
//           body: {
//             padding: isMobile ? 16 : 24,
//           },
//         }}
//       >
//         <div style={{ marginBottom: 24 }}>
//           <Title level={isMobile ? 4 : 2} style={{ marginBottom: 4 }}>
//             User details
//           </Title>
//           <Text type="secondary">Update your personal details here.</Text>
//         </div>

//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={{
//             userAccount: user?.username,
//             name: user?.fullname,
//             email: user?.email,
//           }}
//         >
//           <Row gutter={isMobile ? 12 : 16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="User Account"
//                 name="userAccount"
//                 rules={[{ required: true }]}
//               >
//                 <Input disabled />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Factory"
//                 name="factory"
//                 rules={[{ required: true, message: requiredMessage }]}
//               >
//                 <Select
//                   placeholder="Select factory"
//                   options={[
//                     { label: "LYV", value: "LYV" },
//                     { label: "LVL", value: "LVL" },
//                     { label: "LHG", value: "LHG" },
//                     { label: "LYM", value: "LYM" },
//                   ]}
//                 />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Name"
//                 name="name"
//                 rules={[{ required: true, message: requiredMessage }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Email"
//                 name="email"
//                 rules={[
//                   { required: true, message: requiredMessage },
//                   { type: "email", message: "Invalid email" },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col xs={24} md={12}>
//               <Form.Item label="Change Password" name="password">
//                 <Input.Password
//                   placeholder="Enter new password"
//                   iconRender={(visible) =>
//                     visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//                   }
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <div
//             style={{
//               marginTop: 24,
//               textAlign: isMobile ? "center" : "right",
//             }}
//           >
//             <Button
//               loading={loading}
//               onClick={handleSave}
//               className="save-button"
//               style={{
//                 width: isMobile ? "100%" : undefined,
//                 // maxWidth: isMobile ? 300 : undefined,
//               }}
//             >
//               {loading ? "Saving" : "Save"}
//               <Save />
//             </Button>
//           </div>
//         </Form>
//       </Card>
//     </div>
//   );
// }
