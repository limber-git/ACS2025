import React, { useState, useRef } from "react";
import { api } from "../../../services/api";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onSubmit: (data: ApplicationFormData) => void;
}

function extractHour(timeTable: string) {
  const parts = timeTable.split(" ");
  return parts.length > 1 ? parts[1] : timeTable;
}

function formatDateEnglish(dateStr: string) {
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface ApplicationFormData {
  recordId: string;
  reason: string;
  file?: string | null;
  userId: string;
  userName?: string;
  regularDate: string;
  regularTime: string;
  type: string;
}


type ModalView = "form" | "camera" | "preview";

const CameraView: React.FC<{
  onCapture: (file: File, preview: string) => void;
  onCancel: () => void;
}> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions.");
      onCancel();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
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

const PreviewView: React.FC<{
  imageUrl: string;
  onConfirm: () => void;
  onRetake: () => void;
  onCancel: () => void;
}> = ({ imageUrl, onConfirm, onRetake, onCancel }) => (
  <div className="flex flex-col h-[500px] sm:h-[400px]">
    <div className="flex-1 relative bg-gray-900 p-4">
      <div className="relative h-full rounded-lg overflow-hidden bg-white/10">
        <img
          src={imageUrl}
          alt="Preview"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      <div className="absolute top-4 left-4">
        <h3 className="text-white text-lg font-semibold">Preview</h3>
        <p className="text-white/70 text-sm">
          Check if the image is clear and readable
        </p>
      </div>
    </div>
    <div className="p-4 bg-white dark:bg-gray-800 flex justify-center space-x-4">
      <Button
        type="button"
        onClick={onConfirm}
        variant="primary"
        className="w-32"
      >
        Confirm
      </Button>
      <Button
        type="button"
        onClick={onRetake}
        variant="outline"
        className="w-32"
      >
        Retake
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

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      if (fileReader.result) {
        resolve(fileReader.result as string);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const getFileAsBase64 = async (file: File): Promise<string> => {
  // Para imágenes usamos convertToBase64
  if (file.type.startsWith("image/")) {
    return convertToBase64(file);
  }
  // Para PDFs y otros documentos
  else if (file.type === "application/pdf") {
    return convertToBase64(file);
  }

  throw new Error(`Unsupported file type: ${file.type}`);
};

const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  record,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>("form");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please upload only PDF, JPEG, or PNG files");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setImagePreview(URL.createObjectURL(selectedFile));
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleClose = () => {
    setFile(null);
    setImagePreview(null);
    setReason("");
    setCurrentView("form");
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Please provide a justification");
      return;
    }

    if (!record) {
      console.error("Record data is missing.");
      alert("Cannot submit request: Record data is missing.");
      return;
    }

    if (!record.recordId) {
      console.error("Record ID is missing.");
      alert("Cannot submit request: Record ID is missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = record?.userId || localStorage.getItem("userId") || "";
      const userName = record?.recordName || localStorage.getItem("userName") || "";

      let imgUrl = null;

      if (file) {
        try {
          const fileBase64 = await getFileAsBase64(file);
          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0];
          const fileType = file.type.startsWith("image/") ? "image" : "document";
          const safeUserName = userName.replace(/[^a-zA-Z0-9_]/g, "") || 
                             userId.replace(/[^a-zA-Z0-9_]/g, "");
          const fileName = `${safeUserName}_${formattedDate}_${fileType}`;

          console.log("Uploading image to ImgBB...");
          const response = await api.uploadImageToImgBB(fileBase64, fileName);

          if (!response.data?.url) {
            throw new Error("No URL received from ImgBB");
          }

          imgUrl = response.data.url;
          console.log("Image uploaded successfully:", response.data);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : "Unknown error";
          const continueSubmission = window.confirm(
            `Failed to upload image (${errorMessage}). Do you want to continue without the image?`
          );
          if (!continueSubmission) {
            return;
          }
        }
      }

      const applicationData: ApplicationFormData = {
        recordId: record.recordId,
        reason,
        userId,
        userName,
        file: imgUrl,
        regularDate: record.date,
        regularTime: extractHour(record.schedule),
        type: record.situation || "N/A",
      };

      console.log("Submitting application with data:", applicationData);
      await onSubmit(applicationData);

      setFile(null);
      setImagePreview(null);
      setReason("");
      handleClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(
        `Error submitting application: ${error instanceof Error ? error.message : "An unknown error occurred"}. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapture = (capturedFile: File, preview: string) => {
    setFile(capturedFile);
    setImagePreview(preview);
    setCurrentView("preview");
  };

  const handleCameraCancel = () => {
    setCurrentView("form");
  };

  const handlePreviewConfirm = () => {
    setCurrentView("form");
  };

  const handlePreviewRetake = () => {
    setCurrentView("camera");
  };

  const handlePreviewCancel = () => {
    setFile(null);
    setImagePreview(null);
    setCurrentView("form");
  };

  const modalContent = () => {
    switch (currentView) {
      case "camera":
        return (
          <CameraView onCapture={handleCapture} onCancel={handleCameraCancel} />
        );
      case "preview":
        return imagePreview ? (
          <PreviewView
            imageUrl={imagePreview}
            onConfirm={handlePreviewConfirm}
            onRetake={handlePreviewRetake}
            onCancel={handlePreviewCancel}
          />
        ) : null;
      default:
        return (
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                Request Justification
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please provide the details to justify your absence or incorrect
                clocking.
              </p>
            </div>

            {record && (
              <div className="mt-3">
                <div className="mb-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                  <h6 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                    Record Details
                  </h6>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Date:
                      </span>{" "}
                      {formatDateEnglish(record.date)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Schedule:
                      </span>{" "}
                      {extractHour(record.schedule)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Issue:
                      </span>{" "}
                      {record.situation || "N/A"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Clock In:
                      </span>{" "}
                      {record.clockIn || "N/A"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Clock Out:
                      </span>{" "}
                      {record.clockOut || "N/A"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Justification
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 text-gray-700 dark:text-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                      rows={4}
                      placeholder="Enter your justification here..."
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 focus:outline-none
              dark:file:bg-blue-700 dark:file:text-gray-100
              dark:hover:file:bg-blue-600"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={() => setCurrentView("camera")}
                        variant="outline"
                        className="min-w-[120px] primary"
                      >
                        Take Photo
                      </Button>
                    </div>

                    {imagePreview && (
                      <div className="mt-4 relative">
                        <div className="relative h-15 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-auto mx-auto object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setImagePreview(null);
                          }}
                          variant="outline"
                          className="mt-2 w-full sm:w-auto"
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={
        currentView === "form" ? handleClose : () => setCurrentView("form")
      }
      className={`max-w-[800px] w-full sm:mx-4 mx-1 rounded-lg ${
        currentView !== "form" ? "p-0 max-h-[98vh]" : "p-4 sm:p-3 lg:p-10"
      } overflow-y-auto max-h-[95vh]`}
    >
      {modalContent()}
    </Modal>
  );
};

export default RequestModal;
