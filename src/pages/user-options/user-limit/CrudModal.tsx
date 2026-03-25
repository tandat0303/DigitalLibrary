import { useEffect, useState } from "react";
import {
  Modal,
  Table,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Space,
} from "antd";
import { useCrudTable, type CrudItem } from "../../../hooks/useCrudTable";
import type { CrudModalProps } from "../../../types/users";
import { AppAlert } from "../../../components/ui/AppAlert";
import { getApiErrorMessage } from "../../../lib/getApiErrorMsg";
import { requiredMessage } from "../../../lib/helpers";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export interface CrudApiHandlers<T extends CrudItem> {
  onCreate?: (data: Omit<T, "key">) => Promise<T> | T;
  onUpdate?: (key: string, data: Partial<T>) => Promise<T> | T;
  onDelete?: (key: string) => Promise<void> | void;
  onFetch?: () => Promise<T[]> | T[];
}

interface ExtendedCrudModalProps<T extends CrudItem> extends CrudModalProps<T> {
  apiHandlers?: CrudApiHandlers<T>;
  onMutated?: () => void;
}

function CrudModal<T extends CrudItem>({
  open,
  onClose,
  topic,
  title,
  fields,
  columns,
  idField,
  buttonText,
  apiHandlers,
  onMutated,
}: ExtendedCrudModalProps<T>) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const {
    dataSource,
    setDataSource,
    selectedRowId,
    selectedRow,
    selectRow,
    clearSelection,
  } = useCrudTable<T>(idField);

  const isEditMode = !!selectedRowId;

  useEffect(() => {
    if (!open) return;

    if (selectedRow) {
      form.setFieldsValue(selectedRow);
    } else {
      form.resetFields();
    }
  }, [selectedRow, open]);

  const fetchData = async () => {
    if (!apiHandlers?.onFetch) return;

    try {
      setLoading(true);

      const res = await apiHandlers.onFetch();
      setDataSource(res ?? []);
    } catch (error) {
      AppAlert({
        icon: "error",
        title: `Fetch ${topic}s failed: ${getApiErrorMessage(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchData();
  }, [open]);

  const handleAdd = async () => {
    const values = form.getFieldsValue();

    try {
      const res = await apiHandlers?.onCreate?.(values);

      if (res)
        AppAlert({ icon: "success", title: `Added new ${topic} successfully` });

      // await fetchData();
      form.resetFields();
      clearSelection();

      onMutated?.();
      onClose();
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
  };

  const handleRefresh = () => {
    form.resetFields();
    clearSelection();
    fetchData();
  };

  const handleEdit = async () => {
    if (!selectedRowId) return;

    const values = form.getFieldsValue();

    try {
      const res = await apiHandlers?.onUpdate?.(selectedRowId, values);

      if (res)
        AppAlert({ icon: "success", title: `Updated ${topic} successfully` });

      await fetchData();
      form.resetFields();
      clearSelection();
      onMutated?.();
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
  };

  const handleRemove = async () => {
    if (!selectedRowId) return;

    try {
      const res = await apiHandlers?.onDelete?.(selectedRowId);

      if (res)
        AppAlert({ icon: "success", title: `Deleted ${topic} successfully` });

      await fetchData();
      form.resetFields();
      clearSelection();
      onMutated?.();
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
  };

  const confirmRemove = () => {
    if (!selectedRowId) return;

    Modal.confirm({
      title: `REMOVE ${topic.toUpperCase()}`,
      content: `Are you sure to remove this ${topic}?`,
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      onOk: () => handleRemove(),
    });
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => {
        clearSelection();
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={900}
      centered
      destroyOnHidden
      forceRender
    >
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          paddingTop: 16,
        }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {fields.map((field) => {
              const disabled =
                (isEditMode && field.disabledOnEdit) ||
                (!isEditMode && field.disabledOnCreate);

              return (
                <Col span={12} key={field.name}>
                  <Form.Item
                    name={field.name}
                    label={field.label}
                    rules={
                      field.name === "Status" ||
                      (field.name === "ModuleID" && isEditMode)
                        ? []
                        : [{ required: true, message: requiredMessage }]
                    }
                  >
                    {field.type === "select" ? (
                      <Select
                        disabled={disabled}
                        options={field.options?.map((opt) => ({
                          value: opt.value,
                          label: opt.label,
                        }))}
                      />
                    ) : (
                      <Input disabled={disabled} />
                    )}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>

          <Space style={{ marginBottom: 16 }}>
            <Button className="add-btn" onClick={handleAdd}>
              {buttonText?.add || "Add"}
            </Button>

            <Button className="extra-actions-btn" onClick={handleRefresh}>
              {" "}
              {buttonText?.refresh || "Refresh"}
            </Button>

            <Button
              className="edit-btn"
              disabled={!selectedRowId}
              onClick={handleEdit}
            >
              {buttonText?.edit || "Edit"}
            </Button>

            <Button
              className="delete-btn"
              disabled={!selectedRowId}
              onClick={confirmRemove}
            >
              {buttonText?.remove || "Remove"}
            </Button>
          </Space>
        </Form>

        <div className="w-full">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            rowKey={(record) => String(record[idField])}
            pagination={false}
            scroll={{ x: "max-content", y: 300 }}
            onRow={(record) => ({
              onClick: () => selectRow(record),
            })}
            rowClassName={(record) =>
              record[idField] === selectedRowId
                ? "custom-selected-row cursor-pointer"
                : "cursor-pointer"
            }
          />
        </div>
      </div>
    </Modal>
  );
}

export default CrudModal;
