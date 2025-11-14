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

          // Avoid hard-redirect when 401 happens on auth endpoints (e.g. login)
          // or when we're already on the login page. In those cases, let the caller
          // handle the error so the UI can display feedback without a page reload.
          const requestUrl: string = error?.config?.url || '';
          const isAuthEndpoint = /\/api\/auth\//.test(requestUrl);
          const onLoginPage = typeof window !== 'undefined' && window.location?.pathname === '/login';

          if (!isAuthEndpoint && !onLoginPage) {
            window.location.href = '/login';
          }
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
