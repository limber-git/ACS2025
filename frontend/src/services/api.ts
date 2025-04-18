import { config } from '../config/config';
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

  // Aquí puedes agregar más métodos para otros endpoints
}

export const api = new ApiService();
