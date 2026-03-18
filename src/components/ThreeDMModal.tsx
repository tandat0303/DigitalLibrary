import { Modal } from "antd";
import { Suspense, lazy } from "react";

const ThreeDMViewer = lazy(() => import("./ThreeDMViewer"));

interface ThreeDMModalProps {
  open: boolean;
  file: File | null;
  onClose: () => void;
}

export default function ThreeDMModal({
  open,
  file,
  onClose,
}: ThreeDMModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={file?.name ? `3D Viewer - ${file.name}` : "3D Viewer"}
      width="60vw"
      centered
      destroyOnHidden
      styles={{
        body: { height: "70vh", padding: 0, overflow: "hidden" },
      }}
    >
      {file && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            </div>
          }
        >
          <ThreeDMViewer file={file} />
        </Suspense>
      )}
    </Modal>
  );
}
