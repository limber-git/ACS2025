import React, { useState, Suspense, useMemo } from "react";
import { api } from "../../../services/api";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { RequestModalProps } from "../../../utils/attendance/constants";
import { ApplicationFormData } from "../../../utils/attendance/constants";
import { ModalView } from "../../../utils/attendance/constants";
import {
  extractHour,
  formatDateEnglish,
  getFileAsBase64,
} from "../../../utils/attendance/recordUtils";
import Label from "../../form/Label";

const LazyCameraView = React.lazy(() =>
  import("./views/CameraView").then((module) => ({
    default: module.CameraView,
  }))
);

const LazyPreviewView = React.lazy(() =>
  import("./views/PreviewView").then((module) => ({
    default: module.PreviewView,
  }))
);

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
  const [selectedType, setSelectedType] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please upload, JPEG, or PNG files");
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
    setSelectedType(record?.situation || ""); // Resetear al valor original
    setCurrentView("form");
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (
      selectedType !== "Vacation" &&
      selectedType !== "Sick" &&
      !reason.trim()
    ) {
      alert("Please provide a justification");
      return;
    }

    if ((selectedType === "Vacation" || selectedType === "Sick") && !file) {
      alert("Please upload a supporting document for Vacation or Sick leave.");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = record?.userId || localStorage.getItem("userId") || "";
      const userName =
        record?.recordName || localStorage.getItem("userName") || "";

      let imgUrl = null;

      if (file) {
        try {
          const fileBase64 = await getFileAsBase64(file);
          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0];
          const fileType = file.type.startsWith("image/")
            ? "image"
            : "document";
          const safeUserName =
            userName.replace(/[^a-zA-Z0-9_]/g, "") ||
            userId.replace(/[^a-zA-Z0-9_]/g, "");
          const fileName = `<span class="math-inline">\{safeUserName\}\_</span>{formattedDate}_${fileType}`;

          const response = await api.uploadImageToImgBB(fileBase64, fileName);

          if (!response.data?.url) {
            throw new Error("No URL received from ImgBB");
          }

          imgUrl = response.data.url;
        } catch (uploadError) {
          const errorMessage =
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown error";
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
        reason:
          selectedType === "Vacation" || selectedType === "Sick"
            ? reason
            : reason, // Mantener reason si es necesario
        userId,
        userName,
        file: imgUrl,
        regularDate: record.date,
        regularTime: extractHour(record.schedule),
        type: selectedType, // Usar el tipo seleccionado
        state:
          (selectedType === "Vacation" || selectedType === "Sick") && file
            ? "Approved"
            : "Pending", // Lógica de aprobación automática
      };
      await onSubmit(applicationData);

      setFile(null);
      setImagePreview(null);
      setReason("");
      setSelectedType(record?.situation || "");
      handleClose();
    } catch (error) {
      alert(
        `Error submitting application: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }. Please try again.`
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

  const typeOptions = useMemo(() => {
    const options = [];
    // Si hay una situación en el record, permitirla como opción (y seleccionarla por defecto)
    if (record?.situation) {
      options.push({ value: record.situation, label: record.situation });
    }
    // Agregar las opciones de reemplazo/justificación comunes
    const commonOptions = [
      { value: "Vacation", label: "Vacation" },
      { value: "Sick", label: "Sick" },
      { value: "Commission", label: "Commission" },
      { value: "Replacement", label: "Replacement" },
    ];
    // Agregar opciones específicas según la falta de clock-in/out o retrasos
    if (!record?.clockIn && !record?.clockOut) {
      options.push(...commonOptions);
    } else if (!record?.clockIn) {
      options.push(
        { value: "Missed Check-in", label: "Missed Check-in" },
        {
          value: "Checked in without marking",
          label: "Checked in without marking",
        }
      );
    } else if (!record?.clockOut) {
      options.push(
        { value: "Missed Check-out", label: "Missed Check-out" },
        { value: "Left Early", label: "Left Early" },
        { value: "Left without marking", label: "Left without marking" },
        { value: "Left late", label: "Left late" }
      );
    } else if (record?.late != null) {
      options.push({ value: "Arrived Late", label: "Arrived Late" });
    } else if (record?.early != null) {
      options.push({ value: "Left Early", label: "Left Early" });
    } else {
      options.push(
        ...commonOptions.filter(
          (opt) => opt.value !== "Vacation" && opt.value !== "Sick"
        )
      ); // Si no hay issue específico, mostrar otras opciones
    }

    // Eliminar duplicados (en caso de que la situación ya esté en las opciones comunes)
    const uniqueOptions = options.filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value)
    );

    return uniqueOptions;
  }, [record]);

  const isAutoApprovable = useMemo(() => {
    const keywords = [
      "certificado",
      "médico",
      "reposo",
      "hospital",
      "vacaciones",
      "viaje",
    ];
    return (
      keywords.some((word) => reason.toLowerCase().includes(word)) && !!file
    );
  }, [reason, file]);

  const modalContent = () => {
    switch (currentView) {
      case "camera":
        return (
          <Suspense fallback={<div>Loading camera...</div>}>
            <LazyCameraView
              onCapture={handleCapture}
              onCancel={handleCameraCancel}
            />
          </Suspense>
        );
      case "preview":
        return imagePreview ? (
          <Suspense fallback={<div>Loading preview...</div>}>
            <LazyPreviewView
              imageSrc={imagePreview}
              onConfirm={handlePreviewConfirm}
              onRetake={handlePreviewRetake}
              onCancel={handlePreviewCancel}
            />
          </Suspense>
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

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* Tipo de justificación */}
                  <div>
                    <label
                      htmlFor="justificationType"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Type of Justification
                    </label>

                    <select
                      id="justificationType"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">-- Select an option --</option>
                      {typeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* Mensaje de autoaprobación */}
                    {isAutoApprovable && (
                      <div className="mt-3 rounded-lg border border-green-400 bg-green-50 p-3 text-sm font-medium text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300">
                        Justificación detectada como válida con comprobante.
                        Esta solicitud será aprobada automáticamente.
                      </div>
                    )}

                    {/* Mensaje para Vacation o Sick */}
                    {(selectedType === "Vacation" ||
                      selectedType === "Sick") && (
                      <div className="mt-3 text-yellow-700 dark:text-yellow-300 text-sm italic">
                        Please upload the supporting document (e.g. medical or
                        vacation proof). You can add additional details below if
                        needed.
                      </div>
                    )}
                  </div>

                  {/* Campo de texto solo si no es vacation/sick */}
                  {selectedType !== "Vacation" && selectedType !== "Sick" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Justification
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        rows={3}
                        placeholder="Enter your justification here..."
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Justification{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        rows={2}
                        placeholder="Enter additional details if needed..."
                      />
                    </div>
                  )}
                  {/* Advertencia si es sick o vacation y no subió archivo aún */}
                  {(selectedType === "vacation" || selectedType === "sick") &&
                    !file && (
                      <div className="mt-4 flex items-start gap-2 text-red-800 bg-red-50 dark:bg-red-900/30 dark:text-red-300 border border-red-300 dark:border-red-500 p-3 rounded-lg text-sm">
                        {/* <Info className="w-5 h-5 mt-0.5 shrink-0" /> */}
                        <span>
                          This justification requires you to upload a
                          certificate (e.g., a medical certificate or vacation
                          document).
                          <br />
                          If you decide not to upload the file, the request will
                          be sent as <strong>pending</strong> and must be
                          reviewed by a supervisor.
                        </span>
                      </div>
                    )}

                  {/* Adjuntar archivo / tomar foto */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {!file && (
                        <>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,application/pdf"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none dark:file:bg-blue-700 dark:file:text-gray-100 dark:hover:file:bg-blue-600"
                          />
                          <Button
                            type="button"
                            onClick={() => setCurrentView("camera")}
                            variant="outline"
                            className="min-w-[140px]"
                          >
                            Take Photo
                          </Button>
                        </>
                      )}
                    </div>

                    {imagePreview && (
                      <div className="mt-4 relative flex flex-col items-center">
                        <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-1 border border-gray-300 dark:border-gray-600">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-20 w-auto object-contain"
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

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-6">
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
