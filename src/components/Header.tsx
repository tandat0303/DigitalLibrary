import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Loading from "./ui/Loading";
import { useLoadingNavigate } from "../hooks/useLoadingNavigate";
import { useAppDispatch } from "../hooks/auth";
import { logout } from "../features/authSlice";
import storage from "../lib/storage";

export default function Header() {
  const dispatch = useAppDispatch();

  const { handleNavigate, loading } = useLoadingNavigate();

  const handleLogout = () => {
    storage.remove("accessToken");

    dispatch(logout());

    window.location.href = "/login";
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
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
          className="font-semibold tracking-wide text-xl cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          LYG
        </div>

        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="cursor-pointer text-[18px] flex items-center gap-1 hover:text-gray-300">
            Administrators <DownOutlined className="text-xs" />
          </div>
        </Dropdown>
      </header>
    </>
  );
}
