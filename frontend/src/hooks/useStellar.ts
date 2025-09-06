import { useState, useCallback } from 'react';
import { stellarService } from '@/services/stellar.service';
import type { BuildTransactionParams } from '@/services/stellar.service';

export function useStellar() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildTransaction = useCallback(async (params: BuildTransactionParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await stellarService.buildTransaction(params);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao construir transação';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signTransaction = useCallback(async (keyId: string, txHashBase64: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await stellarService.signTransaction({ keyId, txHashBase64 });
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao assinar transação';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitTransaction = useCallback(async (signedXdr: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await stellarService.submitTransaction(signedXdr);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao submeter transação';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAccountInfo = useCallback(async (accountId: string) => {
    setLoading(true);
    setError(null);

    try {
      const info = await stellarService.getAccountInfo(accountId);
      return info;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao obter informações da conta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validatePublicKey = useCallback((publicKey: string) => {
    return stellarService.validatePublicKey(publicKey);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    buildTransaction,
    signTransaction,
    submitTransaction,
    getAccountInfo,
    validatePublicKey,
    loading,
    error,
    clearError,
  };
}
