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
      method: 'POST',
      token
    });
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
  ): Promise<{ applications: Application[]; pagination: any }> {
    let endpoint = config.endpoints.auth.getApplicationsByUser.replace(':id', userId);
    const params: string[] = [];
    if (page !== undefined) params.push(`page=${page}`);
    if (limit !== undefined) params.push(`limit=${limit}`);
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;    
    return this.request<{ applications: Application[]; pagination: any }>(endpoint);
  }
}

export const api = new ApiService();
