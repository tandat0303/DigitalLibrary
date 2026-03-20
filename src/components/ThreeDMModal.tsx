import { Modal } from "antd";
import { Suspense, lazy, useEffect, useState } from "react";

const ThreeDMViewer = lazy(() => import("./ThreeDMViewer"));

interface ThreeDMModalProps {
  open: boolean;
  file?: File | null;
  fileUrl?: string | null;
  fileName?: string;
  onClose: () => void;
}

export default function ThreeDMModal({
  open,
  file,
  fileUrl,
  fileName,
  onClose,
}: ThreeDMModalProps) {
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let objectUrl: string | null = null;

    if (file) {
      objectUrl = URL.createObjectURL(file);
      setSource(objectUrl);
    } else {
      setSource(fileUrl ?? null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file, fileUrl, open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        file?.name
          ? `3D Viewer - ${file.name}`
          : fileName
            ? `3D Viewer - ${fileName}`
            : "3D Viewer"
      }
      width="60vw"
      centered
      destroyOnHidden
      styles={{
        body: { height: "70vh", padding: 0, overflow: "hidden" },
      }}
    >
      {source && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            </div>
          }
        >
          <ThreeDMViewer key={source} url={source} />
        </Suspense>
      )}
    </Modal>
  );
}
