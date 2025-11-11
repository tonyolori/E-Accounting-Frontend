import { apiService } from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<{ user: User; token: string }>>('/api/auth/login', credentials);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<{ user: User; token: string }>>('/api/auth/register', userData);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/api/auth/me');
    return response.data.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<ApiResponse<{ token: string }>>('/api/auth/refresh');
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiService.post('/api/auth/logout');
  }

  // Token management utilities
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  setUserData(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  getUserData(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
