import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { formatDateEnglish } from "../../../utils/attendance/recordUtils";
import { api } from "../../../services/api";
import { ApplicationDetailsModalProps } from "../../../utils/attendance/constants";

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  isOpen,
  onClose,
  application,
  onDeleted,
}) => {
  const [reviewerName, setReviewerName] = useState<string | null>(null);
  const [loadingReviewer, setLoadingReviewer] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchReviewerName = async () => {
      if (!application?.by) {
        setReviewerName(null);
        return;
      }

      try {
        setLoadingReviewer(true);
        const response = await api.getUserById(application.by);
        setReviewerName(response?.data.fullName || "Unknown reviewer");
      } catch (error) {
        setReviewerName("Error fetching name");
      } finally {
        setLoadingReviewer(false);
      }
    };

    if (isOpen && application?.by) {
      fetchReviewerName();
    }
  }, [isOpen, application]);

  if (!application) return null;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const handleDelete = async () => {
    if (!application) return;

    try {
      setDeleting(true);
      await api.deleteApplication(application.applicationId); // Asegúrate que exista esta función
      if (onDeleted) {
        onDeleted();
      }
      onClose();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Error deleting the application. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] w-full rounded-lg p-4 sm:p-6"
    >
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Application Details
        </h2>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submission Date
              </p>
              <p className="font-medium text-gray-800 dark:text-white">
                {formatDateEnglish(application.submissionDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review Date
              </p>
              <p className="font-medium text-gray-800 dark:text-white">
                {application.reviewDate
                  ? formatDateEnglish(application.reviewDate)
                  : "Not reviewed yet"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {application.type}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="font-medium">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-sm font-medium ${getStatusClass(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Regular Time
              </p>
              <p className="font-medium text-gray-800 dark:text-white">
                {application.regularTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {application.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">State</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {application.state ? "Activo" : "Inactivo"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reviewed By
              </p>
              <p className="font-medium text-gray-800 dark:text-white">
                {loadingReviewer
                  ? "Loading..."
                  : reviewerName
                  ? reviewerName
                  : application.status === "Approved"
                  ? "Approved by prof"
                  : "Not reviewed yet"}
              </p>
            </div>
          </div>

          <div className={`mt-4 ${application.reason ? "" : "hidden"}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400">Reason</p>
            <p className="font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-700 p-3 rounded-md mt-1 border border-gray-200 dark:border-gray-600">
              {application.reason}
            </p>
          </div>

          {application.suggestion && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reviewer Suggestion
              </p>
              <p className="font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-700 p-3 rounded-md mt-1 border border-gray-200 dark:border-gray-600">
                {application.suggestion}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          {application.status === "Pending" && (
            <Button
              onClick={handleDelete}
              variant="primary"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button onClick={onClose} variant="primary">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationDetailsModal;
