import { useState } from "react";
import { Card, Input, Button, Table, Row, Col, Form, Select, Tabs } from "antd";
import {
  columns,
  levelOptions,
  type DataType,
  type PermissionType,
} from "../../../types/users";
import { data } from "../../../types/samples";
import type { ColumnsType } from "antd/es/table";
import ModuleMgmtModal from "./ModuleMgmtModal";
import MenuMgmtModal from "./MenuMgmtModal";
import FilterCollapse from "../../../components/FilterCollapse";
import CustomPagination from "../../../components/CustomPagination";

export default function UserLimit() {
  const [form] = Form.useForm();

  const [selectedUser, setSelectedUser] = useState<DataType | null>(data[0]);
  const [permissionData, setPermissionData] = useState<PermissionType[]>([]);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = data.length;

  const paginatedData = data.slice(
    (current - 1) * pageSize,
    current * pageSize,
  );

  const [selectedPermissionKey, setSelectedPermissionKey] = useState<
    string | null
  >(null);

  const [openModuleModal, setOpenModuleModal] = useState(false);
  const [openMenuModal, setOpenMenuModal] = useState(false);

  const rightColumns: ColumnsType<PermissionType> = [
    { title: "User ID", dataIndex: "userId" },
    { title: "Factory", dataIndex: "factory" },
    { title: "Module", dataIndex: "module" },
    { title: "Menu", dataIndex: "menu" },
    {
      title: "Level",
      dataIndex: "level",
      render: (_, record) => (
        <Select
          value={record.level}
          style={{ width: 120 }}
          options={levelOptions}
          onChange={(value) => {
            setPermissionData((prev) =>
              prev.map((item) =>
                item.key === record.key ? { ...item, level: value } : item,
              ),
            );
          }}
        />
      ),
    },
  ];

  const handleFilter = (values: any) => {
    console.log("Filter values:", values);
  };

  const handleSelectUser = (record: DataType) => {
    if (selectedUser?.account === record.account) {
      setSelectedUser(null);
      setPermissionData([]);
      setSelectedPermissionKey(null);
      return;
    }

    setSelectedUser(record);

    setPermissionData([
      {
        key: "1",
        userId: record.account,
        module: "GENERAL",
        menu: "COLORS",
        level: 0,
      },
      {
        key: "2",
        userId: record.account,
        module: "GENERAL",
        menu: "MATERIALS",
        level: 4,
      },
      {
        key: "3",
        userId: record.account,
        module: "GENERAL",
        menu: "MATERIAL TEST REPORT",
        level: 2,
      },
    ]);

    setSelectedPermissionKey(null);
  };

  const handleSave = () => {
    console.log("Saving permission:", permissionData);
  };

  const renderPermissionTable = () => (
    <Table
      columns={rightColumns}
      dataSource={permissionData}
      rowKey="key"
      pagination={false}
      scroll={{ x: "max-content" }}
      onRow={(record) => ({
        onClick: () =>
          setSelectedPermissionKey((prev) =>
            prev === record.key ? null : record.key,
          ),
      })}
      rowClassName={(record) =>
        record.key === selectedPermissionKey
          ? "custom-selected-row cursor-pointer"
          : "cursor-pointer"
      }
    />
  );

  return (
    <div className="relative">
      <Row gutter={[16, 16]} style={{ marginBottom: 10 }}>
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
                    Search
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    className="btn-custom"
                    onClick={() => setOpenModuleModal(true)}
                  >
                    Module MGMT
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    className="btn-custom"
                    onClick={() => setOpenMenuModal(true)}
                  >
                    Menu MGMT
                  </Button>
                </Form.Item>
              </>
            }
          >
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="account" label="Account">
                <Input />
              </Form.Item>
            </Col>
          </FilterCollapse>
        </Col>

        <Col xs={24} lg={6}>
          <Card
            size="small"
            title="Permission"
            className="adidas-font"
            styles={{
              header: {
                background: "#000",
                color: "#fff",
                fontSize: 14,
              },
              body: {
                fontSize: 13,
                lineHeight: 1.6,
              },
            }}
          >
            <div>
              <strong>0</strong> – Administrator
            </div>
            <div>
              <strong>1</strong> – All functions
            </div>
            <div>
              <strong>2</strong> – View
            </div>
            <div>
              <strong>3</strong> – No View
            </div>
            <div>
              <strong>4</strong> – View + Edit
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={8}>
          <Card
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            styles={{
              body: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Table
              columns={columns}
              dataSource={paginatedData}
              pagination={false}
              rowKey="account"
              scroll={{ x: "max-content", y: 500 }}
              onRow={(record) => ({
                onClick: () => handleSelectUser(record),
              })}
              rowClassName={(record) =>
                record.account === selectedUser?.account
                  ? "custom-selected-row cursor-pointer"
                  : "cursor-pointer"
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
          {selectedUser && (
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 8,
                }}
              >
                <Button
                  className="btn-custom"
                  onClick={handleSave}
                  disabled={!selectedPermissionKey}
                >
                  Save
                </Button>
              </div>

              <Tabs
                className="permission-tabs"
                defaultActiveKey="GENERAL"
                tabBarGutter={12}
                moreIcon={null}
                size="large"
                items={["GENERAL", "CI", "ESG", "IT", "PLANNING", "VR"].map(
                  (tab) => ({
                    key: tab,
                    label: tab,
                    children: renderPermissionTable(),
                  }),
                )}
              />
            </Card>
          )}
        </Col>
      </Row>

      <ModuleMgmtModal
        open={openModuleModal}
        onClose={() => setOpenModuleModal(false)}
      />

      <MenuMgmtModal
        open={openMenuModal}
        onClose={() => setOpenMenuModal(false)}
      />
    </div>
  );
}
