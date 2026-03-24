import { useEffect, useState } from "react";
import { Card, Input, Button, Table, Space, Row, Col, Form, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { usersDataColumns, type UsersDataType } from "../../../types/users";
import CustomPagination from "../../../components/CustomPagination";
import UsersModal from "./UsersModal";
import { AppAlert } from "../../../components/ui/AppAlert";
import FilterCollapse from "../../../components/FilterCollapse";
import { Search } from "lucide-react";
import userApi from "../../../api/users.api";
import { buildQueryFilters } from "../../../lib/buildQueryFilters";
import { getApiErrorMessage } from "../../../lib/getApiErrorMsg";
import authApi from "../../../api/auth.api";
import { useAppDispatch, useAppSelector } from "../../../hooks/auth";
import { updateUserInfo } from "../../../features/authSlice";
import storage from "../../../lib/storage";

export default function Users() {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [data, setData] = useState<UsersDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UsersDataType | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const fetchUsers = async () => {
    try {
      setLoading(true);

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

      setData(rows);
      setTotal(res.total);
    } catch (error) {
      console.log("Failed to fetch users: ", error);
      AppAlert({ icon: "error", title: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [current, pageSize, filters]);

  const handleFilter = (values: any) => {
    const newFilters = buildQueryFilters(values);

    setFilters(newFilters);
    setCurrent(1);
  };

  const handleSelectUSer = (record: UsersDataType) => {
    if (selectedRow?.UserID === record.UserID) {
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
    if (!selectedRow) {
      AppAlert({ icon: "warning", title: "Please choose a row data" });
      return;
    }

    setMode("edit");
    setOpenModal(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectedRow) return;

      const res = await userApi.deleteUser(selectedRow.UserID);

      if (res.success) {
        setSelectedRow(null);
        AppAlert({ icon: "success", title: res.message });
      }

      await fetchUsers();
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
  };

  const confirmRemove = () => {
    if (!selectedRow) {
      AppAlert({ icon: "warning", title: "Please choose a row data" });
      return;
    }

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
      try {
        const res = await authApi.register(values);

        if (res)
          AppAlert({ icon: "success", title: "Added new user successfully" });

        setOpenModal(false);
        setSelectedRow(null);

        await fetchUsers();
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    } else {
      try {
        if (!selectedRow) return;

        const res = await userApi.updateUser(selectedRow.UserID, values);
        if (res) {
          AppAlert({ icon: "success", title: "User updated successfully" });

          if (selectedRow.UserID === currentUser?.userid) {
            dispatch(
              updateUserInfo({
                fullname: values.FullName ?? values.fullname,
                email: values.Email ?? values.email,
              }),
            );

            const currentAuth = storage.get("auth");
            if (currentAuth) {
              storage.set("auth", {
                ...currentAuth,
                data: {
                  ...currentAuth.data,
                  fullname: values.FullName ?? values.fullname,
                  email: values.Email ?? values.email,
                },
              });
            }
          }
        }

        setOpenModal(false);
        setSelectedRow(null);

        await fetchUsers();
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
      }
    }
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
                <Form.Item>
                  <Button className="btn-custom" htmlType="submit">
                    <Search size={13} />
                    Search
                  </Button>
                  {/* <Button onClick={() => form.resetFields()}>
                          Reset
                        </Button> */}
                </Form.Item>
              </>
            }
          >
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="Username" label="User Account">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item name="FullName" label="Name">
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
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
              <Space
                wrap
                className="w-full [&>*]:w-full lg:w-auto lg:[&>*]:w-auto"
              >
                <Button
                  className="add-btn w-full lg:w-auto"
                  onClick={handleCreate}
                >
                  NEW USER
                </Button>

                <Button
                  className="edit-btn w-full lg:w-auto"
                  // disabled={!selectedRow}
                  onClick={handleEdit}
                >
                  EDIT USER
                </Button>

                <Button
                  className="delete-btn w-full lg:w-auto"
                  // disabled={!selectedRow}
                  onClick={confirmRemove}
                >
                  REMOVE USER
                </Button>
              </Space>
            </div>

            <div className="w-full mt-1">
              <Table
                loading={loading}
                columns={usersDataColumns}
                dataSource={data}
                rowKey="UserID"
                pagination={false}
                scroll={{ x: "max-content" }}
                onRow={(record) => ({
                  onClick: () => {
                    handleSelectUSer(record);
                  },
                })}
                rowClassName={(record) =>
                  record.UserID === selectedRow?.UserID
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
