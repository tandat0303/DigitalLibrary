import { useEffect, useState } from "react";
import { Input, Button, Row, Col, Form } from "antd";
import { usersDataColumns, type UsersDataType } from "../../../types/users";
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
import ConfirmRemoveModal from "../../../components/ui/ConfirmRemoveModal";
import DataTableSection from "../../../components/DataTableSection";

export default function Users() {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [data, setData] = useState<UsersDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const selectedRow = data.find((r) => r.UserID === selectedID) ?? null;

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
    setFilters(buildQueryFilters(values));
    setCurrent(1);
  };

  const handleSelectUSer = (record: UsersDataType) => {
    setSelectedID((prev) => (prev === record.UserID ? null : record.UserID));
  };

  const handleCreate = () => {
    setMode("create");
    setSelectedID(null);
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
        setSelectedID(null);
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

    ConfirmRemoveModal({ topic: "user", onOk: handleDelete });
  };

  const handleSubmit = async (values: any) => {
    if (mode === "create") {
      try {
        const res = await authApi.register(values);

        if (res)
          AppAlert({ icon: "success", title: "Added new user successfully" });

        setOpenModal(false);
        setSelectedID(null);

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
        setSelectedID(null);

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

      <DataTableSection<UsersDataType>
        dataSource={data}
        columns={usersDataColumns}
        rowKey="UserID"
        loading={loading}
        selectedRowKey={selectedID ?? undefined}
        onRowClick={handleSelectUSer}
        total={total}
        current={current}
        pageSize={pageSize}
        onPageChange={setCurrent}
        onPageSizeChange={setPageSize}
        actionBar={{
          buttons: [
            {
              label: "NEW USER",
              tooltip: "Create new user",
              className: "add-btn",
              onClick: handleCreate,
            },
            {
              label: "EDIT USER",
              tooltip: "Update user information",
              className: "edit-btn",
              onClick: handleEdit,
            },
            {
              label: "REMOVE USER",
              tooltip: "Delete user",
              className: "delete-btn",
              onClick: confirmRemove,
            },
          ],
        }}
      />

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
