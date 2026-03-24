import type { ColumnsType } from "antd/es/table";
import type { CrudItem } from "../hooks/useCrudTable";
import { Select } from "antd";

{
  /* ---------- User Limit Module ---------- */
}

export interface UserPermissionsDataType extends CrudItem {
  PermissionID: string;
  Level: number;
  MenuID: string;
  ModuleID: string;
  MenuName: string;
  ModuleName: string;
}

export const columns: ColumnsType<UsersDataType> = [
  {
    title: "Account",
    dataIndex: "Username",
    sorter: (a, b) => a.Username.localeCompare(b.Username),
    defaultSortOrder: "ascend",
  },
  {
    title: "Name",
    dataIndex: "FullName",
    sorter: (a, b) => a.FullName.localeCompare(b.FullName),
    sortDirections: ["ascend", "descend"],
  },
];

export interface PermissionType {
  key: string;
  userId: string;
  factory?: string;
  module: string;
  menu: string;
  level?: number;
}

export const levelOptions = [0, 1, 2, 3, 4].map((num) => ({
  value: num,
  label: num.toString(),
}));

export const getPermissionColumns = (
  levelOptions: { label: string; value: number }[],
  onLevelChange: (key: string, value: number) => void,
  username?: string,
): ColumnsType<UserPermissionsDataType> => [
  {
    title: "User ID",
    width: 110,
    render: () => username ?? "",
  },
  {
    title: "Factory",
    // dataIndex: "factory",
    width: 90,
  },
  {
    title: "Module",
    dataIndex: "ModuleName",
    width: 110,
  },
  {
    title: "Menu",
    dataIndex: "MenuName",
  },
  {
    title: "Level",
    dataIndex: "Level",
    width: 130,
    render: (_, record) => (
      <Select
        value={record.Level}
        style={{ width: 110 }}
        options={levelOptions}
        onChange={(value) => onLevelChange(record.PermissionID, Number(value))}
        onMouseDown={(e) => e.stopPropagation()}
      />
    ),
  },
];

type SelectOption<T = string | boolean | number> = {
  label: string;
  value: T;
};

interface FieldConfig<T = any> {
  name: string;
  label: string;
  type?: "input" | "select";
  options?: SelectOption<T>[];
  disabledOnEdit?: boolean;
  disabledOnCreate?: boolean;
  hiddenOnEdit?: boolean;
  hiddenOnCreate?: boolean;
}

export interface CrudModalProps<T extends CrudItem> {
  open: boolean;
  onClose: () => void;
  topic: string;
  title: string;
  fields: FieldConfig[];
  columns: ColumnsType<T>;
  idField: keyof T;
  buttonText?: {
    add?: string;
    refresh?: string;
    edit?: string;
    remove?: string;
  };
}

const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

// Module MGMT
export interface ModuleType extends CrudItem {
  ModuleID: string;
  Name_EN: string;
  Name_VN: string;
  Name_CN: string;
  Status?: boolean;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const moduleFields = [
  { name: "Name_EN", label: "Name (EN)" },
  { name: "Name_VN", label: "Name (VN)" },
  { name: "Name_CN", label: "Name (CN)" },
  {
    name: "Status",
    label: "Status",
    type: "select" as const,
    options: statusOptions,
  },
];

export const moduleColumns: ColumnsType<ModuleType> = [
  {
    title: "Name (EN)",
    dataIndex: "Name_EN",
    sorter: (a, b) => a.Name_EN.localeCompare(b.Name_EN),
    defaultSortOrder: "ascend",
  },
  {
    title: "Name (VN)",
    dataIndex: "Name_VN",
    sorter: (a, b) => a.Name_VN.localeCompare(b.Name_VN),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Name (CN)",
    dataIndex: "Name_CN",
    sorter: (a, b) => a.Name_CN.localeCompare(b.Name_CN),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Status",
    dataIndex: "Status",
    sorter: (a, b) => Number(a.Status ?? false) - Number(b.Status ?? false),
    sortDirections: ["ascend", "descend"],
    render: (status?: boolean) => (status ? "Active" : "Inactive"),
  },
];

// Menu MGMT
export interface MenuType extends CrudItem {
  MenuID: string;
  ModuleID: string;
  ModuleName: string;
  Name_EN: string;
  Name_VN: string;
  Name_CN: string;
  Status?: boolean;
}

export const getMenuFields = (
  moduleOptions: { label: string; value: string }[],
) => [
  {
    name: "ModuleID",
    label: "Module",
    type: "select" as const,
    options: moduleOptions,
    disabledOnEdit: true,
  },
  { name: "Name_EN", label: "Name (EN)" },
  { name: "Name_VN", label: "Name (VN)" },
  { name: "Name_CN", label: "Name (CN)" },
  {
    name: "Status",
    label: "Status",
    type: "select" as const,
    options: statusOptions,
  },
];

export const menuColumns: ColumnsType<MenuType> = [
  {
    title: "Module",
    dataIndex: "ModuleName",
    sorter: (a, b) => (a.ModuleName ?? "").localeCompare(b.ModuleName ?? ""),
    defaultSortOrder: "ascend",
  },
  {
    title: "Name (EN)",
    dataIndex: "Name_EN",
    sorter: (a, b) => a.Name_EN.localeCompare(b.Name_EN),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Name (VN)",
    dataIndex: "Name_VN",
    sorter: (a, b) => a.Name_VN.localeCompare(b.Name_VN),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Name (CN)",
    dataIndex: "Name_CN",
    sorter: (a, b) => a.Name_CN.localeCompare(b.Name_CN),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Status",
    dataIndex: "Status",
    sorter: (a, b) => Number(a.Status ?? false) - Number(b.Status ?? false),
    sortDirections: ["ascend", "descend"],
    render: (status?: boolean) => (status ? "Active" : "Inactive"),
  },
];

{
  /* ---------- Users Module ---------- */
}

export interface UsersDataType extends CrudItem {
  UserID: string;
  Username: string;
  Email: string;
  Factory: string;
  FullName: string;
  PhoneNumber: string;
  AvatarUrl: string;
  VendorCode: string;
  IsActive: boolean;
  LevelPermission: string;
  CreatedBy: string;
}

export interface UsersResponse {
  data: UsersDataType[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const usersDataColumns: ColumnsType<UsersDataType> = [
  {
    title: "User Account",
    dataIndex: "Username",
    sorter: (a, b) => a.Username.localeCompare(b.Username),
    defaultSortOrder: "ascend",
  },
  {
    title: "Factory",
    dataIndex: "Factory",
    sorter: (a, b) => (a.Factory ?? "").localeCompare(b.Factory ?? ""),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Level Permission",
    dataIndex: "LevelPermission",
    sorter: (a, b) => a.LevelPermission.localeCompare(b.LevelPermission),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Name",
    dataIndex: "FullName",
    sorter: (a, b) => a.FullName.localeCompare(b.FullName),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Email",
    dataIndex: "Email",
    sorter: (a, b) => (a.Email ?? "").localeCompare(b.Email ?? ""),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Vendor Code",
    dataIndex: "VendorCode",
    sorter: (a, b) => (a.VendorCode ?? "").localeCompare(b.VendorCode ?? ""),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "User Created",
    dataIndex: "CreatedBy",
    sorter: (a, b) => a.CreatedBy.localeCompare(b.CreatedBy),
    sortDirections: ["ascend", "descend"],
  },
];

interface UserFormValues {
  UserID: string;
  Username: string;
  Email: string;
  Factory: string;
  FullName: string;
  PhoneNumber: string;
  AvatarUrl: string;
  VendorCode: string;
  IsActive: boolean;
  LevelPermission: string;
  CreatedBy: string;
}

export interface UsersModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<UserFormValues> | null;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

{
  /* ---------- User Info Module ---------- */
}
export interface User {
  userid: string;
  username: string;
  email: string;
  fullname: string;
}
