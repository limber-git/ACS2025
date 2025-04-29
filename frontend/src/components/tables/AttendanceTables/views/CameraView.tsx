import React, { useRef, useEffect } from "react";
import Button from "../../../ui/button/Button";
import { CameraViewProps } from "../../../../utils/attendance/constants";

export const CameraView: React.FC<CameraViewProps> = ({
  onCapture,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    startCamera();

    return () => {
      isMounted.current = false;
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current && isMounted.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      } else {
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions.");
      onCancel();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera-capture.jpg", {
                type: "image/jpeg",
              });
              const preview = URL.createObjectURL(blob);
              onCapture(file, preview);
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-[400px] sm:h-[500px]">
      <div className="flex-1 relative bg-gray-900 p-4">
        <div className="relative h-full rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none border-2 border-white/30 rounded-lg"></div>
        </div>
        <div className="absolute top-4 left-4">
          <h3 className="text-white text-lg font-semibold">Take a Photo</h3>
          <p className="text-white/70 text-sm">
            Position your document within the frame
          </p>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 flex justify-center space-x-4">
        <Button
          type="button"
          onClick={capturePhoto}
          variant="primary"
          className="w-32"
        >
          Take Photo
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="w-32"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
