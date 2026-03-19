import type { ColumnsType } from "antd/es/table";
import type { CrudItem } from "../hooks/useCrudTable";

{
  /* ---------- User Limit Module ---------- */
}
export interface DataType {
  key: string;
  account: string;
  name: string;
}

export const columns: ColumnsType<DataType> = [
  {
    title: "Account",
    dataIndex: "account",
    sorter: (a, b) => a.account.localeCompare(b.account),
    defaultSortOrder: "ascend",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
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
  value: num.toString(),
  label: num.toString(),
}));

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
export interface UsersDataType {
  key: string;
  userAccount: string;
  factory?: string;
  levelPermission: string;
  name: string;
  email?: string;
  vendorCode?: string;
  userCreated: string;
}

export const usersDataColumns: ColumnsType<UsersDataType> = [
  {
    title: "User Account",
    dataIndex: "userAccount",
    sorter: (a, b) => a.userAccount.localeCompare(b.userAccount),
    defaultSortOrder: "ascend",
  },
  {
    title: "Factory",
    dataIndex: "factory",
    sorter: (a, b) => (a.factory ?? "").localeCompare(b.factory ?? ""),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Level Permission",
    dataIndex: "levelPermission",
    sorter: (a, b) => a.levelPermission.localeCompare(b.levelPermission),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => (a.email ?? "").localeCompare(b.email ?? ""),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Vendor Code",
    dataIndex: "vendorCode",
    sorter: (a, b) => (a.vendorCode ?? "").localeCompare(b.vendorCode ?? ""),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "User Created",
    dataIndex: "userCreated",
    sorter: (a, b) => a.userCreated.localeCompare(b.userCreated),
    sortDirections: ["ascend", "descend"],
  },
];

interface UserFormValues {
  name: string;
  email: string;
  factory: string;
  levelPermission: string;
  account: string;
  password?: string;
  vendorCode?: string;
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
