import { useEffect, useState } from "react";
import { Row, Col, Select, Button, Form } from "antd";

interface FilterOption {
  label: string;
  value: string;
  render: () => React.ReactNode;
}

interface Props {
  options: FilterOption[];
  form: any;
  colSpan?: number;
  onChangeActiveCount?: (count: number) => void;
}

export default function AddFilter({
  options,
  form,
  colSpan,
  onChangeActiveCount,
}: Props) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    onChangeActiveCount?.(activeFilters.length);
  }, [activeFilters]);
  const availableOptions = options.filter(
    (opt) => !activeFilters.includes(opt.value),
  );

  const handleAdd = (value: string) => {
    setActiveFilters((prev) => [...prev, value]);
  };

  const handleClearAll = () => {
    form.resetFields(activeFilters);
    setActiveFilters([]);
  };

  return (
    <Row gutter={16}>
      {activeFilters.map((filterValue) => {
        const filter = options.find((o) => o.value === filterValue);
        if (!filter) return null;

        return (
          <Col key={filterValue} span={4}>
            {filter.render()}
          </Col>
        );
      })}

      {availableOptions.length > 0 && (
        <Col span={colSpan}>
          <Form.Item label="Add Filter">
            <Select
              key={activeFilters.join("-")}
              placeholder="Select filter"
              options={availableOptions}
              onChange={handleAdd}
            />
          </Form.Item>
        </Col>
      )}

      {activeFilters.length > 0 && (
        <Col span={2}>
          <Form.Item label=" ">
            <Button
              type="link"
              onClick={handleClearAll}
              style={{ padding: 0, color: "gray", fontWeight: "bold" }}
            >
              Clear Filter ✕
            </Button>
          </Form.Item>
        </Col>
      )}
    </Row>
  );
}
