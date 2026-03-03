import { Modal, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { AppAlert } from "./ui/AppAlert";
import { Camera } from "lucide-react";

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
  onCapture?: (image: string) => void;
}

export default function CameraModal({
  open,
  onClose,
  onCapture,
}: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStream(mediaStream);
      setCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      AppAlert({ icon: "error", title: `Cannot access camera: ${err}` });
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setCameraOpen(false);
    setStream(null);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");

    onCapture?.(image);
    stopCamera();
  };

  useEffect(() => {
    if (!open) stopCamera();
  }, [open]);

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
          <div className="w-full h-full flex items-center justify-center">
            {/* {!cameraOpen ? (
            <div className="text-gray-400">Click button to open camera</div>
          ) : ( */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* )} */}
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <Button
              type="primary"
              danger
              shape="round"
              // size="large"
              // icon={<Camera />}
              onClick={cameraOpen ? captureImage : startCamera}
              // style={{
              //   width: 40,
              //   height: 40,
              // }}
            >
              <Camera />
            </Button>
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>
    </Modal>
  );
}
