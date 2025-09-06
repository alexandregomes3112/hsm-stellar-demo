import type { CreateKeyDto, CreateUserDto } from '@/services/hsm.service';
import { hsmService } from '@/services/hsm.service';
import { useCallback, useState } from 'react';

export function useHsm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (data: CreateUserDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await hsmService.createUser(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar usuário';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createKey = useCallback(async (data: CreateKeyDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await hsmService.createKey(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar chave';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPublicKey = useCallback(async (keyId: string, exp?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await hsmService.getPublicKey(keyId, exp);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao obter chave pública';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createUser,
    createKey,
    getPublicKey,
    loading,
    error,
    clearError,
  };
}
