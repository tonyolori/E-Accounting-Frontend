import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic API methods
  public get<T>(url: string, config = {}): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  public post<T>(url: string, data = {}, config = {}): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  public put<T>(url: string, data = {}, config = {}): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  public patch<T>(url: string, data = {}, config = {}): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  public delete<T>(url: string, config = {}): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }
}

export const apiService = new ApiService();
