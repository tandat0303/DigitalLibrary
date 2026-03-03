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

function CrudModal<T extends CrudItem>({
  open,
  onClose,
  title,
  fields,
  columns,
  initialData,
  buttonText,
}: CrudModalProps<T>) {
  const [form] = Form.useForm();

  const {
    dataSource,
    selectedRowKey,
    selectedRow,
    selectRow,
    addItem,
    editItem,
    removeItem,
  } = useCrudTable<T>(initialData);

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue(selectedRow);
    }
  }, [selectedRow]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnHidden
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
          <Button
            type="primary"
            onClick={() => {
              addItem(form.getFieldsValue());
              form.resetFields();
            }}
          >
            {buttonText?.add || "Add"}
          </Button>

          <Button onClick={() => form.resetFields()}>
            {" "}
            {buttonText?.refresh || "Refresh"}
          </Button>

          <Button
            disabled={!selectedRowKey}
            onClick={() => {
              editItem(form.getFieldsValue());
              form.resetFields();
            }}
          >
            {buttonText?.edit || "Edit"}
          </Button>

          <Button
            danger
            disabled={!selectedRowKey}
            onClick={() => {
              removeItem();
              form.resetFields();
            }}
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
    </Modal>
  );
}

export default CrudModal;
