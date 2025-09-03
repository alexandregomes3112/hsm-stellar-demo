import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  StrKey,
  TransactionBuilder,
  Networks,
  Keypair,
  Account,
  xdr,
  Asset,
  Operation,
} from '@stellar/stellar-sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StellarService {
  private networkPassphrase: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.networkPassphrase =
      this.configService.get('NETWORK_PASSPHRASE') || 'Test SDF Network ; September 2015';
  }

  encodeG(pubRaw32: Buffer): string {
    return StrKey.encodeEd25519PublicKey(pubRaw32);
  }

  hintFromPublicKey(pubRaw32: Buffer): Buffer {
    // hint são os últimos 4 bytes (RFC Stellar)
    return Buffer.from(pubRaw32.slice(pubRaw32.length - 4));
  }

  async buildTx({
    sourceAccountId,
    sequence,
    destination,
    amount,
    fee = '100',
    networkPassphrase,
  }: {
    sourceAccountId: string;
    sequence: string;
    destination: string;
    amount: string;
    fee?: string;
    networkPassphrase?: string;
  }) {
    const account = new Account(sourceAccountId, sequence);
    const tx = new TransactionBuilder(account, {
      fee,
      networkPassphrase: networkPassphrase || this.networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination,
          asset: Asset.native(),
          amount,
        }),
      )
      .setTimeout(60)
      .build();

    return tx;
  }

  txHash(tx: any): Buffer {
    return tx.hash(); // já usa a networkPassphrase definida no build
  }

  addSignatureToTx(tx: any, publicKeyG: string, signatureRaw64: Buffer) {
    // Adiciona assinatura (base64) + hint à tx
    const pubRaw = StrKey.decodeEd25519PublicKey(publicKeyG);
    const hint = this.hintFromPublicKey(pubRaw);
    const decorated = new xdr.DecoratedSignature({
      hint: hint,
      signature: signatureRaw64, // Buffer
    });
    tx.signatures.push(decorated);
    return tx;
  }

  async saveTransaction({
    keyId,
    txHash,
    signature,
    sourceAccount,
    destination,
    amount,
    status = 'signed',
  }: {
    keyId: string;
    txHash: string;
    signature: string;
    sourceAccount: string;
    destination?: string;
    amount?: string;
    status?: string;
  }) {
    return await this.prisma.transaction.create({
      data: {
        keyId,
        txHash,
        signature,
        sourceAccount,
        destination,
        amount,
        status,
        networkPassphrase: this.networkPassphrase,
      },
    });
  }
}
