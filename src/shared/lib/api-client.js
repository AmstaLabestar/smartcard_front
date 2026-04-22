import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'smartcard_token';

let invalidTokenHandler = null;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode = error?.response?.data?.error?.code;
    const isInvalidToken = error?.response?.status === 401 && errorCode === 'INVALID_TOKEN';

    if (isInvalidToken) {
      localStorage.removeItem(TOKEN_KEY);
      invalidTokenHandler?.();
    }

    return Promise.reject(error);
  },
);

export function registerInvalidTokenHandler(handler) {
  invalidTokenHandler = handler;
}
