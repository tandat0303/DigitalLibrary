import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/library-loading.json";

interface LoadingProps {
  size?: number;
  fullScreen?: boolean;
  overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 150,
  fullScreen = false,
  overlay = false,
}) => {
  return (
    <div
      style={{
        position: fullScreen || overlay ? "fixed" : "relative",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: overlay ? "rgba(255,255,255,0.6)" : "#f0ede8",
        zIndex: 9999,
      }}
    >
      <div style={{ width: size, height: size }}>
        <Lottie animationData={loadingAnimation} loop />
      </div>
    </div>
  );
};

export default Loading;
