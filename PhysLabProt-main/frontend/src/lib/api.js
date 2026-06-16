import axios from 'axios';

function getDefaultBackendUrl() {
  if (typeof window === 'undefined') return 'http://localhost:8000';
  const host = window.location.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
  return `http://${host}:8000`;
}

function alignBackendHost(url) {
  if (typeof window === 'undefined') return url;
  try {
    const parsed = new URL(url);
    if (window.location.hostname === 'localhost' && parsed.hostname === '127.0.0.1') {
      parsed.hostname = 'localhost';
    }
    if (window.location.hostname === '127.0.0.1' && parsed.hostname === 'localhost') {
      parsed.hostname = '127.0.0.1';
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export const API_BASE_URL = alignBackendHost(process.env.REACT_APP_BACKEND_URL || getDefaultBackendUrl()).replace(/\/+$/, '');
export const API = `${API_BASE_URL}/api`;

export const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const url = String(originalRequest.url || '');
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API}/auth/refresh`, {}, { withCredentials: true });
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
