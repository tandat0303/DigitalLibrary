import { Modal, Button, Progress } from "antd";
import { useRef, useState, useEffect } from "react";
import { AppAlert } from "./ui/AppAlert";
import { Camera } from "lucide-react";
import Webcam from "react-webcam";
import { dataURItoBlob, generateUUID } from "../lib/helpers";
import materialApi from "../api/materials.api";

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
  onCapture?: (image: any) => void;
}

export default function CameraModal({
  open,
  onClose,
  onCapture,
}: CameraModalProps) {
  const webcamRef = useRef<Webcam>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [loading]);

  const captureImage = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;

      setLoading(true);
      setPercent(0);

      const imageBlob = dataURItoBlob(imageSrc);
      if (!imageBlob) {
        AppAlert({
          icon: "error",
          title: "Cannot convert image",
        });
        return;
      }

      const fileName = generateUUID() + ".jpg";

      const formData = new FormData();
      formData.append("file", imageBlob, fileName);
      formData.append("use_clip_rerank", "true");

      const res = await materialApi.searchMaterial(formData);

      setPercent(100);

      setTimeout(() => {
        onCapture?.(res);
        setLoading(false);
        setPercent(0);
      }, 300);
    } catch (err) {
      setLoading(false);

      AppAlert({
        icon: "error",
        title: `Search material failed: ${err}`,
      });
    }
  };

  const handleCameraSuccess = () => {
    setCameraReady(true);
    setCameraError(null);
  };

  const handleCameraError = (err: string | DOMException) => {
    const message =
      typeof err === "string" ? err : err?.message || "Cannot access camera";

    setCameraError(message);

    AppAlert({
      icon: "error",
      title: `Cannot access camera: ${message}`,
    });
  };

  return (
    <Modal
      title="Material Detail"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
      centered
    >
      <div
        style={{
          borderTop: "1px solid #d2d2d2",
          paddingTop: 16,
        }}
      >
        <div className="border border-[#d2d2d2] rounded-lg h-100 relative overflow-hidden">
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Cannot access camera
            </div>
          )}

          {open && !cameraError && (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: "environment" }}
              onUserMedia={handleCameraSuccess}
              onUserMediaError={handleCameraError}
            />
          )}

          {!cameraReady && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Opening camera...
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <Progress
                type="circle"
                percent={Math.round(percent)}
                size={80}
                strokeColor={"#fff"}
                // strokeColor={{
                //   "0%": "#7c3aed",
                //   "100%": "#06b6d4",
                // }}
                railColor={"#8d8d8dff"}
                format={(p) => `${p}%`}
                status="active"
              />
              <div className="text-white mt-3">Processing...</div>
            </div>
          )}

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <Button
              type="primary"
              danger
              shape="round"
              onClick={captureImage}
              disabled={!cameraReady || loading}
            >
              <Camera />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
