import { Form, Input } from "antd";

export const FILTER_OPTIONS = [
  {
    label: "RGB Value",
    value: "rgb",
    render: () => (
      <Form.Item name="RGBValue" label="RGB Value">
        <Input />
      </Form.Item>
    ),
  },
  {
    label: "CMYK Value",
    value: "cmyk",
    render: () => (
      <Form.Item name="CMYKValue" label="CMYK Value">
        <Input />
      </Form.Item>
    ),
  },
];
