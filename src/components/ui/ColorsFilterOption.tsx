import { Form, Input } from "antd";

export const FILTER_OPTIONS = [
  {
    label: "RGB Value",
    value: "rgb",
    render: () => (
      <Form.Item name="RgbValue" label="RGB Value">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "CMYK Value",
    value: "cmyk",
    render: () => (
      <Form.Item name="CmykValue" label="CMYK Value">
        <Input />
      </Form.Item>
    ),
  },
];
