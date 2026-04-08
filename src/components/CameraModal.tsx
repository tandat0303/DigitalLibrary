import { Modal, Button, Progress } from "antd";
import { useRef, useState, useEffect, useCallback } from "react";
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

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  zoom?: number;
  focusMode?: ConstrainDOMString;
  autoFocus?: ConstrainBoolean;
  focusDistance?: ConstrainDouble;
  exposureMode?: ConstrainDOMString;
  whiteBalanceMode?: ConstrainDOMString;
  sharpness?: ConstrainDouble;
}

interface ExtendedMediaTrackConstraints extends Omit<
  MediaTrackConstraints,
  "advanced"
> {
  focusMode?: ConstrainDOMString;
  exposureMode?: ConstrainDOMString;
  whiteBalanceMode?: ConstrainDOMString;
  advanced?: ExtendedMediaTrackConstraintSet[];
}

const VIDEO_CONSTRAINTS: ExtendedMediaTrackConstraints = {
  facingMode: "environment",
  width: { ideal: 1920 }, // request higher resolution for sharpness
  height: { ideal: 1080 },
  focusMode: "continuous",
  advanced: [
    {
      zoom: 1, // no zoom (1 = native)
      focusMode: "continuous",
      autoFocus: true,
      focusDistance: 0, // let the driver decide optimal distance
      exposureMode: "continuous", // auto exposure
      whiteBalanceMode: "continuous", // auto white balance
      sharpness: 100, // max sharpness (supported on some devices)
    },
  ],
};

function applyFocus(stream: MediaStream | null) {
  if (!stream) return;
  const track = stream.getVideoTracks()[0];
  if (!track || typeof track.applyConstraints !== "function") return;
  const constraints: ExtendedMediaTrackConstraints = {
    focusMode: "continuous",
    advanced: [
      {
        focusMode: "continuous",
        autoFocus: true,
        exposureMode: "continuous",
        whiteBalanceMode: "continuous",
      },
    ],
  };
  track.applyConstraints(constraints as MediaTrackConstraints).catch(() => {});
}

function getStream(webcam: Webcam | null): MediaStream | null {
  return (
    ((webcam?.video as HTMLVideoElement | null)
      ?.srcObject as MediaStream | null) ?? null
  );
}

// Threshold for motion detection: 0–255, lower = more sensitive
const MOTION_THRESHOLD = 20;
// Minimum % of pixels that changed to trigger a refocus
const MOTION_PIXEL_RATIO = 0.02;

export default function CameraModal({
  open,
  onClose,
  onCapture,
}: CameraModalProps) {
  const webcamRef = useRef<Webcam>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const motionRafRef = useRef<number>(0);
  // Debounce: don't spam applyConstraints on every motion frame
  const lastRefocusRef = useRef<number>(0);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  const refocusCamera = useCallback(() => {
    applyFocus(getStream(webcamRef.current));
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setPercent((prev) => (prev >= 90 ? prev : prev + Math.random() * 10));
    }, 100);
    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (!open || !cameraReady) return;
    const id = setInterval(() => {
      applyFocus(getStream(webcamRef.current));
    }, 1500);
    return () => clearInterval(id);
  }, [open, cameraReady]);

  useEffect(() => {
    if (!open || !cameraReady) return;

    const canvas = motionCanvasRef.current;
    const video = webcamRef.current?.video as HTMLVideoElement | null;
    if (!canvas || !video) return;

    const W = 160; // downsample for performance
    const H = 90;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const detect = () => {
      if (video.readyState < 2) {
        motionRafRef.current = requestAnimationFrame(detect);
        return;
      }

      ctx.drawImage(video, 0, 0, W, H);
      const current = ctx.getImageData(0, 0, W, H);

      if (prevFrameRef.current) {
        const prev = prevFrameRef.current.data;
        const curr = current.data;
        let changedPixels = 0;
        const totalPixels = W * H;

        for (let i = 0; i < curr.length; i += 4) {
          const diff =
            Math.abs(curr[i] - prev[i]) +
            Math.abs(curr[i + 1] - prev[i + 1]) +
            Math.abs(curr[i + 2] - prev[i + 2]);
          if (diff > MOTION_THRESHOLD) changedPixels++;
        }

        if (changedPixels / totalPixels > MOTION_PIXEL_RATIO) {
          const now = Date.now();
          // Debounce: refocus at most once per 800 ms
          if (now - lastRefocusRef.current > 800) {
            lastRefocusRef.current = now;
            applyFocus(getStream(webcamRef.current));
          }
        }
      }

      prevFrameRef.current = current;
      motionRafRef.current = requestAnimationFrame(detect);
    };

    motionRafRef.current = requestAnimationFrame(detect);
    return () => {
      cancelAnimationFrame(motionRafRef.current);
      prevFrameRef.current = null;
    };
  }, [open, cameraReady]);

  const captureImage = async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot({
        width: 740,
        height: 480,
      });
      if (!imageSrc) return;

      setLoading(true);
      setPercent(0);

      const imageBlob = dataURItoBlob(imageSrc);
      if (!imageBlob) {
        AppAlert({ icon: "error", title: "Cannot convert image" });
        return;
      }

      const fileName = generateUUID() + ".jpg";
      const formData = new FormData();
      formData.append("file", imageBlob, fileName);
      // formData.append("use_clip_rerank", "true");

      const res = await materialApi.searchMaterial(formData);
      setPercent(100);

      setTimeout(() => {
        onCapture?.(res);
        setLoading(false);
        setPercent(0);
        refocusCamera();
      }, 300);
    } catch (err) {
      setLoading(false);
      AppAlert({ icon: "error", title: `Search material failed: ${err}` });
    }
  };

  const handleCameraSuccess = (stream: MediaStream) => {
    setCameraReady(true);
    setCameraError(null);
    applyFocus(stream);
  };

  const handleCameraError = (err: string | DOMException) => {
    const message =
      typeof err === "string" ? err : err?.message || "Cannot access camera";
    setCameraError(message);
    AppAlert({ icon: "error", title: `Cannot access camera: ${message}` });
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
      <div style={{ borderTop: "1px solid #d2d2d2", paddingTop: 16 }}>
        <canvas ref={motionCanvasRef} style={{ display: "none" }} />

        <div className="border border-[#d2d2d2] rounded-lg h-100 relative overflow-hidden">
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Cannot access camera
            </div>
          )}

          {open && !cameraError && (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={1} // jpeg_quality: 100
              mirrored={false} // flip_horiz: false
              width={740}
              height={340}
              className="w-full h-full object-cover"
              videoConstraints={VIDEO_CONSTRAINTS}
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

// import { Modal, Button, Progress } from "antd";
// import { useRef, useState, useEffect, useCallback } from "react";
// import { AppAlert } from "./ui/AppAlert";
// import { Camera } from "lucide-react";
// import Webcam from "react-webcam";
// import { dataURItoBlob, generateUUID } from "../lib/helpers";
// import materialApi from "../api/materials.api";

// interface CameraModalProps {
//   open: boolean;
//   onClose: () => void;
//   onCapture?: (image: any) => void;
// }

// const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
//   facingMode: "environment",
//   width: { ideal: 740 },
//   height: { ideal: 340 },
//   advanced: [
//     {
//       zoom: 0,
//       focusMode: "continuous",
//       autoFocus: true,
//       focusDistance: 0,
//       exposureMode: "continuous",
//       whiteBalanceMode: "continuous",
//     } as MediaTrackConstraintSet,
//   ],
// };

// export default function CameraModal({
//   open,
//   onClose,
//   onCapture,
// }: CameraModalProps) {
//   const webcamRef = useRef<Webcam>(null);

//   const [cameraReady, setCameraReady] = useState(false);
//   const [cameraError, setCameraError] = useState<string | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [percent, setPercent] = useState(0);

//   useEffect(() => {
//     if (!loading) return;

//     const timer = setInterval(() => {
//       setPercent((prev) => {
//         if (prev >= 90) return prev;
//         return prev + Math.random() * 10;
//       });
//     }, 100);

//     return () => clearInterval(timer);
//   }, [loading]);

//   const refocusCamera = useCallback(() => {
//     try {
//       const stream = (webcamRef.current?.video as HTMLVideoElement | null)
//         ?.srcObject as MediaStream | null;
//       const videoTrack = stream?.getVideoTracks()[0];
//       if (videoTrack && typeof videoTrack.applyConstraints === "function") {
//         videoTrack.applyConstraints({
//           advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet],
//         });
//       }
//     } catch (e) {
//       console.log("Cannot re-focus camera: ", e);
//     }
//   }, []);

//   const captureImage = async () => {
//     try {
//       // Use JPEG at full quality to match jpeg_quality: 100
//       const imageSrc = webcamRef.current?.getScreenshot({
//         width: 740,
//         height: 480,
//       });
//       if (!imageSrc) return;

//       setLoading(true);
//       setPercent(0);

//       const imageBlob = dataURItoBlob(imageSrc);
//       if (!imageBlob) {
//         AppAlert({ icon: "error", title: "Cannot convert image" });
//         return;
//       }

//       const fileName = generateUUID() + ".jpg";

//       const formData = new FormData();
//       formData.append("file", imageBlob, fileName);
//       formData.append("use_clip_rerank", "true");

//       const res = await materialApi.searchMaterial(formData);

//       setPercent(100);

//       setTimeout(() => {
//         onCapture?.(res);
//         setLoading(false);
//         setPercent(0);
//         refocusCamera();
//       }, 300);
//     } catch (err) {
//       setLoading(false);
//       AppAlert({ icon: "error", title: `Search material failed: ${err}` });
//     }
//   };

//   const handleCameraSuccess = () => {
//     setCameraReady(true);
//     setCameraError(null);
//   };

//   const handleCameraError = (err: string | DOMException) => {
//     const message =
//       typeof err === "string" ? err : err?.message || "Cannot access camera";

//     setCameraError(message);
//     AppAlert({ icon: "error", title: `Cannot access camera: ${message}` });
//   };

//   return (
//     <Modal
//       title="Material Detail"
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       width={800}
//       destroyOnHidden
//       centered
//     >
//       <div style={{ borderTop: "1px solid #d2d2d2", paddingTop: 16 }}>
//         <div
//           className="border border-[#d2d2d2] rounded-lg h-100 relative overflow-hidden"
//           onClick={refocusCamera}
//         >
//           {cameraError && (
//             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
//               Cannot access camera
//             </div>
//           )}

//           {open && !cameraError && (
//             <Webcam
//               ref={webcamRef}
//               // Matches image_format: "jpeg" + jpeg_quality: 100
//               screenshotFormat="image/jpeg"
//               screenshotQuality={1}
//               // Matches flip_horiz: false
//               mirrored={false}
//               // Matches dest_width/dest_height
//               width={740}
//               height={340}
//               className="w-full h-full object-cover"
//               videoConstraints={VIDEO_CONSTRAINTS}
//               onUserMedia={handleCameraSuccess}
//               onUserMediaError={handleCameraError}
//             />
//           )}

//           {!cameraReady && !cameraError && (
//             <div className="absolute inset-0 flex items-center justify-center text-white">
//               Opening camera...
//             </div>
//           )}

//           {loading && (
//             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
//               <Progress
//                 type="circle"
//                 percent={Math.round(percent)}
//                 size={80}
//                 strokeColor={"#fff"}
//                 railColor={"#8d8d8dff"}
//                 format={(p) => `${p}%`}
//                 status="active"
//               />
//               <div className="text-white mt-3">Processing...</div>
//             </div>
//           )}

//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
//             <Button
//               type="primary"
//               danger
//               shape="round"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 captureImage();
//               }}
//               disabled={!cameraReady || loading}
//             >
//               <Camera />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// }
