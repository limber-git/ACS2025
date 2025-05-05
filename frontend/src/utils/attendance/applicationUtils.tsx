import { ApplicationFormData } from './constants';
import { getFileAsBase64 } from './recordUtils';

/**
 * Traduce el estado numérico de una aplicación a un string entendible.
 * @param status Estado de la aplicación: 0 = Pending, 1 = Approved, 2 = Rejected
 */
export function getApplicationStatusText(status: number): string {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Approved";
    case 2:
      return "Rejected";
    default:
      return "Unknown";
  }
}

/**
 * Devuelve si un record está cubierto por una aplicación aprobada.
 * @param applicationStatus Estado de la aplicación relacionada
 * @returns true si aprobado
 */
export function isApplicationApproved(applicationStatus: number): boolean {
  return applicationStatus === 1;
}

/**
 * Prepara los datos de la aplicación para enviar al servidor.
 * @param record Registro de asistencia
 * @param reason Razón de la solicitud
 * @param file Archivo adjunto (opcional)
 * @param userId ID del usuario
 * @param userName Nombre del usuario (opcional)
 */
export async function prepareApplicationData(
  record: any,
  reason: string,
  file: File | null,
  userId: string,
  userName?: string
): Promise<ApplicationFormData> {
  let imgUrl = null;
  
  if (file) {
    const base64Data = await getFileAsBase64(file);
    imgUrl = base64Data;
  }

  return {
    recordId: record.recordId,
    reason,
    userId,
    userName,
    file: imgUrl,
    regularDate: record.date,
    regularTime: record.onDuty,
    state: record.state,
    status: record.status,
    type: record.situation || 'Attendance Issue',
  };
}

/**
 * Valida los datos de la aplicación antes de enviarla.
 * @param data Datos parciales de la aplicación
 * @returns Mensaje de error o null si todo está bien
 */
export function validateApplicationData(data: Partial<ApplicationFormData>): string | null {
  if (!data.reason?.trim()) {
    return "Please provide a reason";
  }
  if (!data.recordId) {
    return "No record selected";
  }
  if (!data.userId) {
    return "User ID is required";
  }
  return null;
}
export const reviewerText = (loadingReviewer: boolean, reviewerName: string | null, application: any) => loadingReviewer
  ? "Loading..."
  : `${reviewerName || "Not reviewed yet"}${
      application.status === "Approved" ? " - Approved by prof" : ""
    }`;

