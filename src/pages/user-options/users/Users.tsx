import { useState } from "react";
import { Card, Input, Button, Table, Space, Row, Col, Form, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { usersDataColumns, type UsersDataType } from "../../../types/users";
import { initialUsersData } from "../../../types/samples";
import CustomPagination from "../../../components/CustomPagination";
import UsersModal from "./UsersModal";
import { AppAlert } from "../../../components/ui/AppAlert";
import { sleep } from "../../../lib/helpers";
import FilterCollapse from "../../../components/FilterCollapse";

export default function Users() {
  const [form] = Form.useForm();

  const [data, setData] = useState(initialUsersData);
  const [selectedRow, setSelectedRow] = useState<UsersDataType | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = data.length;

  const paginatedData = data.slice(
    (current - 1) * pageSize,
    current * pageSize,
  );

  const handleFilter = (values: any) => {
    console.log("Filter values:", values);
  };

  const handleSelectUSer = (record: UsersDataType) => {
    if (selectedRow?.userAccount === record.userAccount) {
      setSelectedRow(null);
      return;
    }

    setSelectedRow(record);
  };

  const handleCreate = () => {
    setMode("create");
    setSelectedRow(null);
    setOpenModal(true);
  };

  const handleEdit = () => {
    if (!selectedRow) return;
    setMode("edit");
    setOpenModal(true);
  };

  const handleDelete = () => {
    if (!selectedRow) return;

    setData((prev) =>
      prev.filter((item) => item.userAccount !== selectedRow.userAccount),
    );

    setSelectedRow(null);

    AppAlert({ icon: "success", title: "User removed successfully" });
  };

  const confirmRemove = () => {
    Modal.confirm({
      title: "REMOVE USER",
      content: "Are you sure to remove this user?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      onOk: () => handleDelete(),
    });
  };

  const handleSubmit = async (values: any) => {
    if (mode === "create") {
      if (!values.userAccount) return;

      setData((prev) => [
        ...prev,
        {
          ...values,
          key: values.userAccount,
        },
      ]);

      AppAlert({ icon: "success", title: "Added new user successfully" });
    } else {
      setData((prev) =>
        prev.map((item) =>
          item.userAccount === selectedRow?.userAccount ? values : item,
        ),
      );

      AppAlert({ icon: "success", title: "User updated successfully" });
    }

    await sleep(500);

    setOpenModal(false);
    setSelectedRow(null);
  };

  return (
    <>
      {/* FILTER */}
      <Row gutter={24}>
        <Col span={24}>
          <FilterCollapse
            form={form}
            onFinish={handleFilter}
            title="FILTERS"
            visibleFilterCount={2}
            actions={
              <>
                <Button className="btn-custom" htmlType="submit">
                  Search
                </Button>
                {/* <Button onClick={() => form.resetFields()}>
                          Reset
                        </Button> */}
              </>
            }
          >
            <Col span={6}>
              <Form.Item name="userAccount" label="User Account">
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="name" label="Name">
                <Input />
              </Form.Item>
            </Col>
          </FilterCollapse>
        </Col>
      </Row>

      {/* TABLE */}
      <Row gutter={24}>
        <Col span={24}>
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
            <Space style={{ marginBottom: 12 }}>
              <Button className="actions-btn" onClick={handleCreate}>
                NEW USER
              </Button>

              <Button
                className="actions-btn"
                disabled={!selectedRow}
                onClick={handleEdit}
              >
                EDIT USER
              </Button>

              <Button
                className="actions-btn"
                disabled={!selectedRow}
                onClick={confirmRemove}
              >
                REMOVE USER
              </Button>
            </Space>

            <div style={{ flex: 1 }}>
              <Table
                columns={usersDataColumns}
                dataSource={paginatedData}
                rowKey="userAccount"
                pagination={false}
                scroll={{ y: 500 }}
                onRow={(record) => ({
                  onClick: () => {
                    handleSelectUSer(record);
                  },
                })}
                rowClassName={(record) =>
                  record.userAccount === selectedRow?.userAccount
                    ? "custom-selected-row"
                    : ""
                }
              />
            </div>

            <CustomPagination
              total={total}
              current={current}
              pageSize={pageSize}
              onChange={setCurrent}
              onPageSizeChange={setPageSize}
            />
          </Card>
        </Col>
      </Row>

      <UsersModal
        open={openModal}
        mode={mode}
        initialValues={mode === "edit" ? selectedRow : undefined}
        onCancel={() => setOpenModal(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
