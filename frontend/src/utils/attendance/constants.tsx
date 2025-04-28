// Estados de Aplicaciones
export const APPLICATION_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

// Colores asociados al estado de aplicación (para badges por ejemplo)
export const APPLICATION_STATUS_COLORS: Record<number, string> = {
  [APPLICATION_STATUS.PENDING]: 'yellow',
  [APPLICATION_STATUS.APPROVED]: 'green',
  [APPLICATION_STATUS.REJECTED]: 'red',
};

// Tipos para las vistas del modal
export type ModalView = 'form' | 'camera' | 'preview';

export interface AttendanceRecordCalculated {
  date: string;
  schedule: string;
  onDuty?: string;
  offDuty?: string;
  clockIn: string | null;
  clockOut: string | null;
  late: boolean; // O number si ya son minutos
  early: boolean; // O number si ya son minutos
  situation: string | null;
  needsApplication: boolean;
  recordId: string;
  recordName: string;
  recordState: boolean;
  userId?: string;
  applicationId: string | null;
  applicationStatus: string | null;
  
}
// Interfaces para los datos del formulario
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

// Props para los componentes
export interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onSubmit: (data: ApplicationFormData) => void;
}

export interface FormViewProps {
  record: any;
  reason: string;
  setReason: (value: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onTakePhoto: () => void;
}

export interface CameraViewProps {
  onCapture: (file: File, preview: string) => void;
  onCancel: () => void;
}

export interface PreviewViewProps {
  imageSrc: string;
  onConfirm: () => void;
  onRetake: () => void;
  onCancel: () => void;
}
export const stylesTable = {
  className: "px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400"
}
  
