import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Loading from "./ui/Loading";
import { useLoadingNavigate } from "../hooks/useLoadingNavigate";
import { useAppDispatch, useAppSelector } from "../hooks/auth";
import { logout } from "../features/authSlice";
import storage from "../lib/storage";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const { handleNavigate, loading } = useLoadingNavigate();

  const handleLogout = () => {
    storage.remove("auth");

    dispatch(logout());

    window.location.href = "/login";
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    setOpen(false);

    switch (key) {
      case "user-limit":
        handleNavigate("/user-limit");
        break;

      case "users":
        handleNavigate("/users");
        break;

      case "user-info":
        handleNavigate("/user-info");
        break;

      case "logout":
        handleLogout();
        break;
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "user-limit",
      label: "User Limit",
    },
    {
      key: "users",
      label: "Users",
    },
    {
      key: "user-info",
      label: "User Info",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      // danger: true,
    },
  ];

  return (
    <>
      {loading && <Loading fullScreen overlay />}

      <header className="w-full bg-black text-white flex items-center justify-between box-border px-1.5 py-1.5">
        <div
          className="font-semibold tracking-wide text-base cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          LYG
        </div>

        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          trigger={["click"]}
          placement="bottomRight"
          arrow={true}
          open={open}
          onOpenChange={(flag) => setOpen(flag)}
        >
          <div className="cursor-pointer text-[18px] flex items-center gap-1 hover:text-gray-300">
            {user?.fullname}{" "}
            <DownOutlined
              className={`text-xs transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </Dropdown>
      </header>
    </>
  );
}
