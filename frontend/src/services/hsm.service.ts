import { api } from './api';
import type { CreateUserResponse, CreateKeyResponse, GetPublicKeyResponse } from './api';
import { API_ENDPOINTS } from '@/config/api';

export interface CreateUserDto {
  userId: string;
  password: string;
  permissions?: string[];
}

export interface CreateKeyDto {
  keyName: string;
  algorithm: string;
  exp?: boolean;
  temp?: boolean;
  userId: string;
}

export const hsmService = {
  async createUser(data: CreateUserDto): Promise<CreateUserResponse> {
    const response = await api.post<CreateUserResponse>(API_ENDPOINTS.createUser, data);
    return response.data;
  },

  async createKey(data: CreateKeyDto): Promise<CreateKeyResponse> {
    const response = await api.post<CreateKeyResponse>(API_ENDPOINTS.createKey, data);
    return response.data;
  },

  async getPublicKey(keyId: string, exp?: string): Promise<GetPublicKeyResponse> {
    const params = exp ? { exp } : undefined;
    const response = await api.get<GetPublicKeyResponse>(API_ENDPOINTS.getPublicKey(keyId), {
      params,
    });
    return response.data;
  },
};
