import axios from 'axios';
import type { AxiosError } from 'axios';
import { OpenAPI } from './generated';
import { AutenticaciNService } from './generated';

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

function getToken(): string | null {
  return localStorage.getItem('token');
}

function onRefreshed(token: string) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

function addPendingRequest(cb: (token: string) => void) {
  pendingRequests.push(cb);
}

export function setupInterceptors() {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosError['config'] & { _retry?: boolean };

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addPendingRequest((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await AutenticaciNService.refresh({ refreshToken });
        const newToken = response.accessToken;
        const newRefreshToken = response.refreshToken || refreshToken;

        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        OpenAPI.TOKEN = async () => newToken;

        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch {
        clearAuth();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    },
  );
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('usuario');
  window.location.href = '/login';
}
