import Logo from "../assets/LYLogo_White 1.png";
import LoginBanner from "../assets/login-banner.jpg";
import { Form, Input, Button } from "antd";
import {
  IdcardOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import type { LoginPayload } from "../types/auth";
import authApi from "../api/auth.api";
import { setToken } from "../features/authSlice";
import { AppAlert } from "../components/ui/AppAlert";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getApiErrorMessage } from "../lib/getApiErrorMsg";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { accessToken, user, isHydrated } = useAppSelector((s) => s.auth);

  if (!isHydrated) return null;
  if (accessToken && user) return <Navigate to="/" replace />;

  const handleSubmit = async (values: LoginPayload) => {
    setLoading(true);

    try {
      const data = await authApi.login(values);

      const accessToken = data?.accessToken;
      const user = data?.data;

      if (!accessToken || !user) {
        AppAlert({
          icon: "error",
          title: "Invalid username or password",
        });

        return;
      }

      dispatch(setToken({ accessToken, data: user }));

      navigate("/", { replace: true });
    } catch (error) {
      AppAlert({
        icon: "error",
        title: getApiErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="flex flex-col justify-center flex-1 px-6 py-10 sm:px-10 md:px-12">
          <div className="mb-6 flex justify-center">
            <img src={Logo} alt="Logo" className="h-16 object-contain" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center">
            Welcome Back !
          </h1>

          <p className="text-sm text-gray-400 mb-8 text-center">
            Please enter your details
          </p>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="w-full max-w-md mx-auto md:mx-0"
            autoComplete="off"
          >
            {/* Account */}
            <Form.Item
              label="Account"
              name="username"
              rules={[{ required: true, message: "Please enter your account" }]}
            >
              <Input
                prefix={<IdcardOutlined />}
                size="large"
                className="login-input"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="login-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                className="login-button"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Right Side */}
        {/*max-h-[520px]*/}
        <div className="hidden md:flex md:w-[45%] bg-gray-200 items-center justify-center p-6">
          <img
            src={LoginBanner}
            alt="Workspace illustration"
            className="w-full h-full max-h-130 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
