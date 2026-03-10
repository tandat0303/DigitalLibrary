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
export interface ModuleType {
  key: string;
  nameEn: string;
  nameVn: string;
  nameCn: string;
  status?: string;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const moduleFields = [
  { name: "nameEn", label: "Name (EN)" },
  { name: "nameVn", label: "Name (VN)" },
  { name: "nameCn", label: "Name (CN)" },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    options: statusOptions,
  },
];

export const moduleColumns: ColumnsType<ModuleType> = [
  {
    title: "Name (EN)",
    dataIndex: "nameEn",
    sorter: (a, b) => a.nameEn.localeCompare(b.nameEn),
    defaultSortOrder: "ascend",
  },
  {
    title: "Name (VN)",
    dataIndex: "nameVn",
    sorter: (a, b) => a.nameVn.localeCompare(b.nameVn),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Name (CN)",
    dataIndex: "nameCn",
    sorter: (a, b) => a.nameCn.localeCompare(b.nameCn),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: (a, b) => (a.status ?? "").localeCompare(b.status ?? ""),
    sortDirections: ["ascend", "descend"],
  },
];

// Menu MGMT
export interface MenuType {
  key: string;
  module?: string;
  nameEn: string;
  nameVn: string;
  nameCn: string;
  status?: string;
}

export const menuFields = [
  {
    name: "module",
    label: "Module",
    type: "select" as const,
    options: moduleOptions,
  },
  { name: "nameEn", label: "Name (EN)" },
  { name: "nameVn", label: "Name (VN)" },
  { name: "nameCn", label: "Name (CN)" },
  {
    name: "status",
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
    dataIndex: "nameEn",
    sorter: (a, b) => a.nameEn.localeCompare(b.nameEn),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Name (VN)",
    dataIndex: "nameVn",
    sorter: (a, b) => a.nameVn.localeCompare(b.nameVn),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Name (CN)",
    dataIndex: "nameCn",
    sorter: (a, b) => a.nameCn.localeCompare(b.nameCn),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: (a, b) => (a.status ?? "").localeCompare(b.status ?? ""),
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
