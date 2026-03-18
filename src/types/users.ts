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

interface FieldConfig {
  name: string;
  label: string;
  type?: "input" | "select";
  options?: { label: string; value: string }[];
}

export interface CrudModalProps<T extends CrudItem> {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  columns: ColumnsType<T>;
  initialData: T[];
  buttonText?: {
    add?: string;
    refresh?: string;
    edit?: string;
    remove?: string;
  };
}

const statusOptions = [" ", "Active", "Inactive"].map((obj) => ({
  value: obj,
  label: obj,
}));

const moduleOptions = [" ", "GENERAL", "CI", "ESG", "IT", "PLANNING", "VR"].map(
  (obj) => ({
    value: obj,
    label: obj,
  }),
);

// Module MGMT
export interface ModuleType extends CrudItem {
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
    // sorter: (a, b) => (a.Status ?? "").localeCompare(b.Status ?? ""),
    // sortDirections: ["ascend", "descend"],
  },
];

// Menu MGMT
export interface MenuType {
  key: string;
  module?: string;
  Name_EN: string;
  Name_VN: string;
  Name_CN: string;
  Status?: string;
}

export const menuFields = [
  {
    name: "module",
    label: "Module",
    type: "select" as const,
    options: moduleOptions,
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
    dataIndex: "module",
    sorter: (a, b) => (a.module ?? "").localeCompare(b.module ?? ""),
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
    sorter: (a, b) => (a.Status ?? "").localeCompare(b.Status ?? ""),
    sortDirections: ["ascend", "descend"],
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
