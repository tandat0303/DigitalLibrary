import Logo from "../assets/LYLogo_White 1.png";
import { Form, Input, Button } from "antd";
import {
  IdcardOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login-banner-animation.json";
import type { LoginPayload } from "../types/auth";
import authApi from "../api/auth.api";
import { setToken } from "../features/authSlice";
import { AppAlert } from "../components/ui/AppAlert";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getApiErrorMessage } from "../lib/getApiErrorMsg";
import Loading from "../components/ui/Loading";
import { requiredMessage } from "../lib/helpers";
import dayjs from "dayjs";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, user, isHydrated } = useAppSelector((s) => s.auth);

  if (!isHydrated) return null;
  if (!navigating && accessToken && user) return <Navigate to="/" replace />;

  const handleSubmit = async (values: LoginPayload) => {
    setLoading(true);
    try {
      const data = await authApi.login(values);
      const accessToken = data?.accessToken;
      const user = data?.data;

      dispatch(setToken({ accessToken, data: user }));
      setNavigating(true);
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        AppAlert({ icon: "error", title: "Invalid account or password" });
      } else {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    } finally {
      setLoading(false);
    }
  };

  if (navigating) return <Loading overlay fullScreen />;

  return (
    <div className="login-page">
      <div className="login-card">
        {/* ── LEFT: Form ── */}
        <div className="login-form-side">
          {/* Brand */}
          <div className="login-brand">
            <img src={Logo} alt="LYG Logo" className="login-logo" />
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Login to continue</p>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="login-form"
            autoComplete="off"
          >
            <Form.Item
              label="Account"
              name="username"
              rules={[{ required: true, message: requiredMessage }]}
            >
              <Input
                prefix={<IdcardOutlined />}
                size="large"
                placeholder="Enter account"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: requiredMessage }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                size="large"
                placeholder="••••••••"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="login-input"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                className="login-button"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>

          <p className="login-footer">
            LYG © {dayjs().year()} — Digital Library
          </p>
        </div>

        {/* ── RIGHT: Lottie banner ── */}
        <div className="login-banner-side">
          <span className="login-ring login-ring--lg" />
          <span className="login-ring login-ring--sm" />

          <div className="login-lottie-wrap">
            <Lottie
              animationData={loginAnimation}
              loop
              className="login-lottie"
            />
          </div>

          <div className="login-tagline">
            <h2>Smart Library</h2>
            <p>
              Internal Management System
              <br />
              LYG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
