export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // HSM endpoints
  createUser: '/hsm/user',
  createKey: '/hsm/keys',
  getPublicKey: (keyId: string) => `/hsm/keys/${keyId}/public`,

  // Stellar endpoints
  signTransaction: '/stellar/sign',
} as const;
