import { type ReactNode, useState } from "react";
import { Card, Collapse, Form, Row, Col, Space, Button, Grid } from "antd";
import type { FormInstance } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface FilterCollapseProps {
  title?: string;
  form: FormInstance;
  onFinish: (values: any) => void;
  children: ReactNode;
  extraFilters?: ReactNode;
  actions?: ReactNode;
  visibleFilterCount: number;
  defaultActive?: boolean;
}

export default function FilterCollapse({
  title = "Filters",
  form,
  onFinish,
  children,
  extraFilters,
  actions,
  visibleFilterCount,
  defaultActive = true,
}: FilterCollapseProps) {
  const [active, setActive] = useState(defaultActive);

  const { useBreakpoint } = Grid;

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const header = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        // justifyContent: "space-between",
        gap: 8,
        width: "100%",
        fontSize: 22,
        fontWeight: "bold",
      }}
    >
      <span className="adidas-font">
        {title} {visibleFilterCount > 0 && `(${visibleFilterCount})`}
      </span>

      <Button
        type="link"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setActive(!active);
        }}
        icon={active ? <UpOutlined /> : <DownOutlined />}
        style={{ color: "gray", fontWeight: "bold", padding: 0, marginLeft: 8 }}
      >
        {active ? "COLLAPSE" : "EXPAND"}
      </Button>
    </div>
  );

  return (
    <div className="mb-4">
      <Collapse
        bordered={false}
        ghost
        activeKey={active ? ["1"] : []}
        items={[
          {
            key: "1",
            label: header,
            showArrow: false,
            children: (
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[16, 8]} align={isMobile ? "top" : "bottom"} wrap>
                  {children}

                  {extraFilters}

                  {actions && (
                    <Col flex="none">
                      <Form.Item>
                        <Space wrap={isMobile}>{actions}</Space>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Form>
            ),
          },
        ]}
      />
    </div>
  );
}
