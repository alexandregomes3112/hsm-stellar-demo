import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/config/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.data) {
      const errorData = error.response.data as any;
      const message = errorData.details || errorData.error || 'Erro desconhecido';
      throw new Error(message);
    }
    throw error;
  },
);

// Types for API responses
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface CreateUserResponse extends ApiResponse {
  user?: {
    id: string;
    userId: string;
    permissions: string[];
  };
}

export interface CreateKeyResponse extends ApiResponse {
  key?: {
    id: string;
    keyName: string;
    algorithm: string;
    exportable: boolean;
    temp: boolean;
  };
}

export interface GetPublicKeyResponse {
  keyId: string;
  publicKey: string;
  publicKeyG: string;
}

export interface SignTransactionResponse {
  signatureBase64: string;
}
