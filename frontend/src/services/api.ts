import { config } from '../config/config';
import type { AttendanceRecord } from '../components/tables/AttendanceTable';
import type { Application } from '../components/tables/ApplicationsTable';
import { LoginResponse, LoginCredentials } from '../types/auth';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.API_URL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    
    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
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

  async getAttendanceByUser(userId: string, page?: number, limit?: number): Promise<AttendanceRecord[] | { records: AttendanceRecord[], total?: number }> {
    let endpoint = config.endpoints.auth.getAttendanceByUser.replace(":id", userId);
    const params: string[] = [];
    if (page !== undefined) params.push(`page=${page}`);
    if (limit !== undefined) params.push(`limit=${limit}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    return this.request<AttendanceRecord[] | { records: AttendanceRecord[], total?: number }>(endpoint, {
      method: 'GET',
    });
  }

  async getApplicationsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    records: Application[],
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  }> {
    const endpoint = config.endpoints.auth.getApplicationsByUser.replace(":id", userId);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return this.request(endpoint + '?' + params.toString(), {
      method: 'GET'
    });
  }
}

export const api = new ApiService();
