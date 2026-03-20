import { Modal, Button } from "antd";
import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (file: File | null) => void;
  acceptedFormat?: string;
}

export default function UploadAttachModal({
  open,
  onClose,
  onImport,
  acceptedFormat,
}: Props) {
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("No file chosen");

  useEffect(() => {
    if (!open) {
      setFile(null);
      setFileName("No file chosen");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // if (!selectedFile.name.endsWith(".xlsx")) {
    //   AppAlert({ icon: "warning", title: "Only .xlsx files are allowed" });
    //   e.target.value = "";
    //   return;
    // }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleOk = () => {
    if (!file) return;
    onImport(file);
    setFile(null);
  };

  return (
    <Modal
      title="New File"
      centered
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          style={{
            background: "#8c8c8c",
            color: "#fff",
            border: "none",
          }}
        >
          Close
        </Button>,
        <Button
          key="import"
          type="primary"
          onClick={handleOk}
          disabled={!file}
          style={{
            background: "#000",
            borderColor: "#000",
            color: "#fff",
          }}
        >
          Import
        </Button>,
      ]}
    >
      <div
        style={{
          textAlign: "left",
          marginBottom: 16,
        }}
      >
        <span className="font-semibold text-zinc-600">File Name</span>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          display: "flex",
          border: "1px solid #d9d9d9",
          borderRadius: 6,
          overflow: "hidden",
          height: 36,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            background: "#f5f5f5",
            borderRight: "1px solid #d9d9d9",
            whiteSpace: "nowrap",
          }}
        >
          Choose File
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            color: "#595959",
            background: "#fff",
          }}
        >
          {fileName}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormat ? acceptedFormat : ".xlsx,.xls,.csv"}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </Modal>
  );
}
