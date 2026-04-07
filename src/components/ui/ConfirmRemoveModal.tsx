import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

interface Props {
  topic: string;
  onOk: () => void;
}

export default function ConfirmRemoveModal({ topic, onOk }: Props) {
  return Modal.confirm({
    title: `Remove ${topic}`.toUpperCase(),
    content: `Are you sure to remove this ${topic}?`,
    okText: "Yes",
    cancelText: "No",
    okType: "danger",
    centered: true,
    icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
    onOk: onOk,
  });
}
