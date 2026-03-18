import { useEffect } from "react";
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

export interface CrudApiHandlers<T extends CrudItem> {
  onCreate?: (data: Omit<T, "key">) => Promise<T> | T;
  onUpdate?: (key: string | number, data: Partial<T>) => Promise<T> | T;
  onDelete?: (key: string | number) => Promise<void> | void;
  onFetch?: () => Promise<T[]> | T[];
}

interface ExtendedCrudModalProps<T extends CrudItem> extends CrudModalProps<T> {
  apiHandlers?: CrudApiHandlers<T>;
}

function CrudModal<T extends CrudItem>({
  open,
  onClose,
  title,
  fields,
  columns,
  initialData,
  buttonText,
  apiHandlers,
}: ExtendedCrudModalProps<T>) {
  const [form] = Form.useForm();

  const {
    dataSource,
    selectedRowKey,
    selectedRow,
    selectRow,
    addItem,
    editItem,
    removeItem,
    clearSelection,
  } = useCrudTable<T>(initialData);

  useEffect(() => {
    if (!open || !apiHandlers?.onFetch) return;
    apiHandlers.onFetch();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (selectedRow) {
      form.setFieldsValue(selectedRow);
    } else {
      form.resetFields();
    }
  }, [selectedRow, open]);

  const handleAdd = async () => {
    const values = form.getFieldsValue();

    if (apiHandlers?.onCreate) {
      try {
        const created = await apiHandlers.onCreate(values);
        addItem(created ?? values);
      } catch (error) {
        console.error("Create failed:", error);
        return;
      }
    } else {
      addItem(values);
    }

    form.resetFields();
  };

  const handleEdit = async () => {
    const values = form.getFieldsValue();

    if (apiHandlers?.onUpdate && selectedRowKey != null) {
      try {
        await apiHandlers.onUpdate(selectedRowKey, values);
      } catch (error) {
        console.error("Update failed:", error);
        return;
      }
    }

    editItem(values);
    form.resetFields();
  };

  const handleRemove = async () => {
    if (apiHandlers?.onDelete && selectedRowKey != null) {
      try {
        await apiHandlers.onDelete(selectedRowKey);
      } catch (error) {
        console.error("Delete failed:", error);
        return;
      }
    }

    removeItem();
    form.resetFields();
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
            {fields.map((field) => (
              <Col span={12} key={field.name}>
                <Form.Item name={field.name} label={field.label}>
                  {field.type === "select" ? (
                    <Select
                      allowClear
                      options={field.options?.map((opt) => ({
                        value: opt.value,
                        label: opt.label,
                      }))}
                    />
                  ) : (
                    <Input />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Space style={{ marginBottom: 16 }}>
            <Button className="add-btn" onClick={handleAdd}>
              {buttonText?.add || "Add"}
            </Button>

            <Button
              className="extra-actions-btn"
              onClick={() => {
                form.resetFields();
                clearSelection();
              }}
            >
              {" "}
              {buttonText?.refresh || "Refresh"}
            </Button>

            <Button
              className="edit-btn"
              disabled={!selectedRowKey}
              onClick={handleEdit}
            >
              {buttonText?.edit || "Edit"}
            </Button>

            <Button
              className="delete-btn"
              disabled={!selectedRowKey}
              onClick={handleRemove}
            >
              {buttonText?.remove || "Remove"}
            </Button>
          </Space>
        </Form>

        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="key"
          pagination={false}
          scroll={{ y: 250 }}
          onRow={(record) => ({
            onClick: () => selectRow(record),
          })}
          rowClassName={(record) =>
            record.key === selectedRowKey
              ? "custom-selected-row cursor-pointer"
              : "cursor-pointer"
          }
        />
      </div>
    </Modal>
  );
}

export default CrudModal;
