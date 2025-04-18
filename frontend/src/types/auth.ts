export interface LoginResponse {
  success: boolean;
  message?: string;
  userLogin: {
    userId: number;
    fullName: string;
    role: string;
    token: string;
  };
}

export interface UserInfo {
  userId: number;
  fullName: string;
  role: string;
}

export interface LoginCredentials {
  user: string;
  password: string;
}
