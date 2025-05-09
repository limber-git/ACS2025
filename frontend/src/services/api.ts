import { config } from '../config/config';
import type { Application } from '../components/tables/ApplicationsTables/ApplicationsTable';
import { LoginResponse, LoginCredentials } from '../types/auth';

interface AttendanceRecord {
  recordId: number;
  date: string;
  schedule: {
    onDuty: string;
    offDuty: string;
  };
  attendance: {
    clockIn: string | null;
    clockOut: string | null;
  };
  status: {
    type: 'PRESENT' | 'LATE' | 'ABSENT' | 'JUSTIFIED';
    justification?: {
      applicationId: number;
      type: string;
      reason: string;
      status: string;
    };
  };
}
// Mantén la definición de la interfaz AttendanceRecord si la necesitas para tipar la respuesta
interface AttendanceRecordCalculated { // Puedes crear una nueva interfaz para la respuesta calculada
  date: string;
  schedule: string;
  clockIn: string | null;
  clockOut: string | null;
  late: boolean; // O number si ya son minutos
  early: boolean; // O number si ya son minutos
  situation: string | null;
  needsApplication: boolean;
  recordId: string;
  recordName: string;
  recordState: boolean;
  applicationId: string | null;
  applicationStatus: string | null;
}

interface User {
  data: any;
  userId: string;
  fullName: string;
  user: string;
}

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.API_URL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    if (options.token) {
      headers.append('Authorization', `Bearer ${options.token}`);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.request(config.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout(token: string) {
    return this.request(config.endpoints.auth.logout, {
      method: 'GET',
      token
    });
  }

  async getUserById(userId: string): Promise<User> {
    const endpoint = config.endpoints.auth.getUserById.replace(':id', userId);
    return this.request<User>(endpoint);
  }

  async getAttendanceByUser(
    userId: string, 
    page?: number, 
    limit?: number,
    startDate?: string,
    endDate?: string
  ): Promise<{ records: AttendanceRecord[], pagination: any }> {
    let endpoint = config.endpoints.auth.getAttendanceByUser.replace(':id', userId);
    const params: string[] = [];
    if (page !== undefined) params.push(`page=${page}`);
    if (limit !== undefined) params.push(`limit=${limit}`);
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;    
    return this.request<{ records: AttendanceRecord[], pagination: any }>(endpoint);
  }

  async getApplicationsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<{
    pagination: any; records: Application[]; total: number; page: number; limit: number 
}> {
    let endpoint = config.endpoints.auth.getApplicationsByUser.replace(':id', userId);
    const params: string[] = [];
    if (page !== undefined) params.push(`page=${page}`);
    if (limit !== undefined) params.push(`limit=${limit}`);
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;    
    return this.request<{ records: Application[]; total: number; page: number; limit: number; pagination: any }>(endpoint);
  }
  
  async getAttendanceByUserCalculated(
    userId: string,
    page?: number,
    limit?: number,
    startDate?: string,
    endDate?: string
  ): Promise<{ records: AttendanceRecordCalculated[], total: number, page: number, limit: number }> {
    let endpoint = config.endpoints.auth.getAttendanceByUserCalculated.replace(':id', userId);
    const params: string[] = [];
    if (page !== undefined) params.push(`page=${page}`);
    if (limit !== undefined) params.push(`limit=${limit}`);
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    return this.request<{ records: AttendanceRecordCalculated[], total: number, page: number, limit: number }>(endpoint);
  }

  async getRecordByIdCalculated(recordId: string): Promise<AttendanceRecordCalculated> {
    const endpoint = config.endpoints.auth.getAttendanceByUserCalculated.replace(':recordId', recordId);
    return this.request<AttendanceRecordCalculated>(endpoint);
  }

  async submitApplication(applicationData: any): Promise<any> {
    console.log('Enviando datos de aplicación (api):', applicationData);
    const endpoint = config.endpoints.auth.submitApplication;
    const token = localStorage.getItem('token'); // O como manejes el token de autenticación
    
    const options: RequestOptions = {
      method: 'POST',
      body: JSON.stringify(applicationData),
      token: token || undefined
    };

    return this.request(endpoint, options);
  }

  async uploadImageToImgBB(base64Image: string, fileName?: string): Promise<any> {
    const endpoint = config.endpoints.auth.uploadImage;
    const token = localStorage.getItem('token') || undefined;
    
    const options: RequestOptions = {
      method: 'POST',
      body: JSON.stringify({
        base64Image,
        fileName
      }),
      token: token || undefined
    };
    
    return this.request(endpoint, options);
  }

  async deleteApplication(applicationId: string): Promise<any> {
    const endpoint = config.endpoints.auth.deleteApplication.replace(':applicationId', applicationId);
    const token = localStorage.getItem('token') || undefined;
    
    const options: RequestOptions = {
      method: 'DELETE',
      token: token || undefined
    };
    
    return this.request(endpoint, options);
  }

  
}

export const api = new ApiService();
