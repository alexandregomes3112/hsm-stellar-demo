import { api } from './api';
import type { SignTransactionResponse } from './api';
import { API_ENDPOINTS } from '@/config/api';
import {
  TransactionBuilder,
  Networks,
  Horizon,
  Asset,
  Account,
  StrKey,
  xdr,
  Memo,
  Operation,
} from '@stellar/stellar-sdk';

export interface SignTransactionDto {
  keyId: string;
  txHashBase64: string;
}

export interface BuildTransactionParams {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: string;
  fee?: string;
  memo?: string;
}

const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || Networks.TESTNET;

export const stellarService = {
  async signTransaction(data: SignTransactionDto): Promise<SignTransactionResponse> {
    const response = await api.post<SignTransactionResponse>(API_ENDPOINTS.signTransaction, data);
    return response.data;
  },

  async buildTransaction(params: BuildTransactionParams) {
    const server = new Horizon.Server(HORIZON_URL);

    // Validate addresses
    if (!StrKey.isValidEd25519PublicKey(params.sourceAccountId)) {
      throw new Error('Endereço de origem inválido');
    }
    if (!StrKey.isValidEd25519PublicKey(params.destinationAccountId)) {
      throw new Error('Endereço de destino inválido');
    }

    // Load source account
    const sourceAccount = await server.loadAccount(params.sourceAccountId);

    // Build transaction
    const builder = new TransactionBuilder(
      new Account(sourceAccount.accountId(), sourceAccount.sequence),
      {
        fee: params.fee || '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      },
    );

    // Add payment operation
    builder.addOperation(
      Operation.payment({
        destination: params.destinationAccountId,
        asset: Asset.native(),
        amount: params.amount,
      }),
    );

    // Add memo if provided
    if (params.memo) {
      builder.addMemo(Memo.text(params.memo));
    }

    // Set timeout
    builder.setTimeout(60);

    // Build the transaction
    const transaction = builder.build();

    return {
      transaction,
      hash: transaction.hash(),
      xdr: transaction.toEnvelope().toXDR('base64'),
    };
  },

  async addSignatureToTransaction(
    transactionXdr: string,
    publicKeyG: string,
    signatureBase64: string,
  ) {
    // Reconstruct transaction from XDR
    const transaction = TransactionBuilder.fromXDR(transactionXdr, NETWORK_PASSPHRASE);

    // Add signature
    const signatureArray = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    const publicKeyBuffer = StrKey.decodeEd25519PublicKey(publicKeyG);
    const hint = publicKeyBuffer.slice(publicKeyBuffer.length - 4);

    // Convert Uint8Array to Buffer for Stellar SDK
    const signatureBuffer = Buffer.from(signatureArray);

    const decoratedSignature = new xdr.DecoratedSignature({
      hint: hint,
      signature: signatureBuffer,
    });

    transaction.signatures.push(decoratedSignature);

    return {
      signedXdr: transaction.toEnvelope().toXDR('base64'),
      transaction,
    };
  },

  async submitTransaction(signedXdr: string) {
    const server = new Horizon.Server(HORIZON_URL);
    const transaction = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

    try {
      const result = await server.submitTransaction(transaction);
      return {
        success: true,
        hash: result.hash,
        result,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.extras?.result_codes?.transaction || 'Erro ao submeter transação',
      );
    }
  },

  validatePublicKey(publicKey: string): boolean {
    return StrKey.isValidEd25519PublicKey(publicKey);
  },

  async getAccountInfo(accountId: string) {
    if (!this.validatePublicKey(accountId)) {
      throw new Error('Endereço inválido');
    }

    const server = new Horizon.Server(HORIZON_URL);

    try {
      const account = await server.loadAccount(accountId);
      return {
        id: account.accountId(),
        sequence: account.sequence,
        balances: account.balances,
        signers: account.signers,
        thresholds: account.thresholds,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Conta não encontrada');
      }
      throw error;
    }
  },
};
