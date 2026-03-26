import { useEffect, useState } from "react";
import { Card, Input, Button, Table, Row, Col, Form, Tabs } from "antd";
import {
  columns,
  getPermissionColumns,
  levelOptions,
  type UsersDataType,
  type UserPermissionsDataType,
} from "../../../types/users";
import ModuleMgmtModal from "./ModuleMgmtModal";
import MenuMgmtModal from "./MenuMgmtModal";
import FilterCollapse from "../../../components/FilterCollapse";
import CustomPagination from "../../../components/CustomPagination";
import {
  Save,
  Search,
  Shield,
  Layers,
  Menu,
  User,
  UserRoundKey,
} from "lucide-react";
import { AppAlert } from "../../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../../lib/getApiErrorMsg";
import userApi from "../../../api/users.api";
import { buildQueryFilters } from "../../../lib/buildQueryFilters";
import moduleMgmtApi from "../../../api/moduleMgmt.api";
import userLimitApi from "../../../api/userLimit.api";

const permissionLevels = [
  { num: 0, label: "Administrator", color: "#ef4444" },
  { num: 1, label: "All functions", color: "#f97316" },
  { num: 2, label: "View only", color: "#3b82f6" },
  { num: 3, label: "No view", color: "#9ca3af" },
  { num: 4, label: "View + Edit", color: "#22c55e" },
];

export default function UserLimit() {
  const [form] = Form.useForm();

  const [userData, setUserData] = useState<UsersDataType[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UsersDataType | null>(null);
  const [permissionData, setPermissionData] = useState<
    UserPermissionsDataType[]
  >([]);
  const [modules, setModules] = useState<
    { ModuleID: string; Name_EN: string }[]
  >([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [permissionLoading, setPermissionLoading] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const [selectedPermissionKey, setSelectedPermissionKey] = useState<
    string | null
  >(null);
  const [openModuleModal, setOpenModuleModal] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setUserLoading(true);

      const params = {
        ...filters,
        page: current,
        limit: pageSize,
      };

      const res = await userApi.getAllUsers(params);

      const rows = res.data.map((item) => ({
        ...item,
        key: item.UserID,
      }));

      setUserData(rows);
      setTotal(res.total);
    } catch (error) {
      console.log("Failed to fetch users data: ", error);
      AppAlert({ icon: "error", title: "Failed to fetch users data" });
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [current, pageSize, filters]);

  const handleLevelChange = (key: string, value: number) => {
    setPermissionData((prev) =>
      prev.map((item) =>
        item.PermissionID === key ? { ...item, LevelPermission: value } : item,
      ),
    );
  };

  const rightColumns = getPermissionColumns(levelOptions, handleLevelChange);

  const handleFilter = (values: any) => {
    const newFilters = buildQueryFilters(values);

    setFilters(newFilters);
    setCurrent(1);
  };

  const handleSelectUser = async (record: UsersDataType) => {
    if (selectedUser?.UserID === record.UserID) {
      setSelectedUser(null);
      setPermissionData([]);
      setModules([]);
      setActiveTab("");
      setSelectedPermissionKey(null);
      return;
    }

    setSelectedUser(null);
    setSelectedPermissionKey(null);
    setPermissionData([]);
    setModules([]);
    setActiveTab("");

    try {
      setPermissionLoading(true);

      const [modulesRes, permissionsRes] = await Promise.all([
        moduleMgmtApi.getAllModules(),
        userLimitApi.getUserPermissions({
          userId: record.UserID,
          moduleID: "85CC1EEC-F650-4AAE-A885-EA8ED02845FA",
        }),
      ]);

      setModules(modulesRes);
      setPermissionData(permissionsRes);
      setActiveTab(modulesRes[0]?.ModuleID ?? "");
      setSelectedUser(record);
    } catch (error) {
      console.log("Failed to load permissions: ", error);
      AppAlert({ icon: "error", title: "Failed to load permissions" });
    } finally {
      setPermissionLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPermissionKey || !selectedUser) return;

    try {
      setSaving(true);

      const permission = permissionData.find(
        (p) => p.PermissionID === selectedPermissionKey,
      );

      if (!permission) return;

      await userLimitApi.saveUserPermissions({
        userId: permission.UserID,
        menuId: permission.MenuID,
        moduleId: permission.ModuleID,
        level: permission.LevelPermission,
      });

      AppAlert({ icon: "success", title: "Permission saved successfully" });

      setSelectedPermissionKey(null);

      await userLimitApi.getUserPermissions({
        userId: selectedUser.UserID,
        moduleID: "85CC1EEC-F650-4AAE-A885-EA8ED02845FA",
      });
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  // const handleRefresh = async () => {
  //   if (!selectedUser) return;

  //   try {
  //     setPermissionLoading(true);

  //     const [modulesRes, permissionsRes] = await Promise.all([
  //       moduleMgmtApi.getAllModules(),
  //       userLimitApi.getUserPermissions({ userId: selectedUser.UserID }),
  //     ]);

  //     setModules(modulesRes);
  //     setPermissionData(permissionsRes);
  //     setSelectedPermissionKey(null);

  //     if (modulesRes.length > 0) setActiveTab(modulesRes[0].ModuleID);
  //   } catch (error) {
  //     AppAlert({ icon: "error", title: getApiErrorMessage(error) });
  //   } finally {
  //     setPermissionLoading(false);
  //   }
  // };

  const handleMutated = () => {
    setSelectedUser(null);
    setPermissionData([]);
    setModules([]);
    setActiveTab("");
    setSelectedPermissionKey(null);
    setCurrent(1);
  };

  const getPermissionsByModule = (moduleId: string) => {
    return permissionData.filter((p) => p.ModuleID === moduleId);
  };

  const renderPermissionTable = (moduleId: string) => (
    <Table
      className="ul-perm-table"
      loading={permissionLoading}
      columns={rightColumns}
      dataSource={getPermissionsByModule(moduleId)}
      rowKey="PermissionID"
      pagination={false}
      scroll={{ x: "max-content" }}
      onRow={(record) => ({
        onClick: (e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest(".ant-select") ||
            target.closest(".ant-select-dropdown")
          ) {
            return;
          }
          setSelectedPermissionKey((prev) =>
            prev === record.PermissionID ? null : record.PermissionID,
          );
        },
      })}
      rowClassName={(record) =>
        record.PermissionID === selectedPermissionKey
          ? "custom-selected-row cursor-pointer"
          : "cursor-pointer"
      }
    />
  );

  return (
    <div className="relative">
      <Row gutter={[16, 12]} style={{ marginBottom: 12 }}>
        <Col xs={24} lg={18}>
          <FilterCollapse
            form={form}
            onFinish={handleFilter}
            title="FILTERS"
            visibleFilterCount={1}
            actions={
              <>
                <Form.Item>
                  <Button className="btn-custom" htmlType="submit">
                    <Search size={13} />
                    Search
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    className="btn-custom"
                    onClick={() => setOpenModuleModal(true)}
                  >
                    <Layers size={13} />
                    Module MGMT
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    className="btn-custom"
                    onClick={() => setOpenMenuModal(true)}
                  >
                    <Menu size={13} />
                    Menu MGMT
                  </Button>
                </Form.Item>
              </>
            }
          >
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="username" label="Account">
                <Input />
              </Form.Item>
            </Col>
          </FilterCollapse>
        </Col>

        <Col xs={24} lg={6}>
          <Card
            size="small"
            className="ul-perm-card"
            title={
              <>
                <Shield size={18} strokeWidth={2.5} />
                Permission Levels
              </>
            }
          >
            {permissionLevels.map(({ num, label, color }) => (
              <div className="ul-perm-row" key={num}>
                <div className="ul-perm-num" style={{ background: color }}>
                  {num}
                </div>
                <span>{label}</span>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 12]}>
        <Col xs={24} xl={8}>
          <Card className="ul-user-card" style={{ height: "100%" }}>
            <Table
              loading={userLoading}
              columns={columns}
              dataSource={userData}
              pagination={false}
              rowKey="UserID"
              scroll={{ x: "max-content" }}
              onRow={(record) => ({
                onClick: () => handleSelectUser(record),
              })}
              rowClassName={(record) =>
                record.UserID === selectedUser?.UserID
                  ? "custom-selected-row"
                  : ""
              }
            />
            <CustomPagination
              total={total}
              current={current}
              pageSize={pageSize}
              onChange={setCurrent}
              onPageSizeChange={setPageSize}
            />
          </Card>
        </Col>

        <Col xs={24} xl={16}>
          <Card className="ul-right-card" style={{ height: "100%" }}>
            {selectedUser ? (
              <>
                <div className="ul-toolbar">
                  <div className="ul-toolbar-user">
                    <div className="ul-toolbar-avatar">
                      <User size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="ul-toolbar-name">
                        {selectedUser.Username}
                      </div>
                      <div className="ul-toolbar-sub">
                        {permissionData.length} permission
                        {permissionData.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-3">
                    <Button className="add-btn" onClick={handleRefresh}>
                      <RefreshCcw size={13} />
                      Refresh
                    </Button> */}
                  <Button
                    className="ul-save-btn"
                    onClick={handleSave}
                    disabled={!selectedPermissionKey}
                    loading={saving}
                  >
                    <Save size={13} />
                    {saving ? "Saving" : "Save"}
                  </Button>
                  {/* </div> */}
                </div>

                <Tabs
                  className="ul-tabs"
                  activeKey={activeTab}
                  onChange={(key) => {
                    setActiveTab(key);
                    setSelectedPermissionKey(null);
                  }}
                  tabBarGutter={4}
                  size="small"
                  items={modules.map((mod) => ({
                    key: mod.ModuleID,
                    label: mod.Name_EN,
                    children: renderPermissionTable(mod.ModuleID),
                  }))}
                />
              </>
            ) : (
              <div className="ul-empty">
                <div className="ul-empty-icon">
                  <UserRoundKey size={22} />
                </div>
                <div className="ul-empty-text">
                  Select an account to manage permissions
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <ModuleMgmtModal
        open={openModuleModal}
        onClose={() => setOpenModuleModal(false)}
        onMutated={handleMutated}
      />
      <MenuMgmtModal
        open={openMenuModal}
        onClose={() => setOpenMenuModal(false)}
        onMutated={handleMutated}
      />
    </div>
  );
}
