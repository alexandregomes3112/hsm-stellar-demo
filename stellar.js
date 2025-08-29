// stellar.js
import { StrKey, TransactionBuilder, Networks, Keypair, Account, xdr } from '@stellar/stellar-sdk';

export function encodeG(pubRaw32) {
  return StrKey.encodeEd25519PublicKey(pubRaw32);
}

export function hintFromPublicKey(pubRaw32) {
  // hint são os últimos 4 bytes (RFC Stellar)
  return Buffer.from(pubRaw32.slice(pubRaw32.length - 4));
}

/** Monta tx para teste (ex.: 1 pagamento de 1 XLM) */
export async function buildTx({ sourceAccountId, sequence, destination, amount, fee = '100', networkPassphrase }) {
  const account = new Account(sourceAccountId, sequence);
  const tx = new TransactionBuilder(account, {
    fee,
    networkPassphrase
  })
    .addOperation({
      type: 'payment',
      destination,
      asset: { code: 'XLM', issuer: null, isNative: true },
      amount
    })
    .setTimeout(60)
    .build();

  return tx;
}

/** Retorna o hash (32 bytes) que deve ser assinado por Ed25519 */
export function txHash(tx, networkPassphrase) {
  return tx.hash(); // já usa a networkPassphrase definida no build
}

/** Adiciona assinatura (base64) + hint à tx */
export function addSignatureToTx(tx, publicKeyG, signatureRaw64) {
  // Algumas versões expõem .addSignature(G, base64)
  // Para máxima compatibilidade: use DecoratedSignature
  const pubRaw = StrKey.decodeEd25519PublicKey(publicKeyG);
  const hint = hintFromPublicKey(pubRaw);
  const decorated = new xdr.DecoratedSignature({
    hint: hint,
    signature: signatureRaw64 // Buffer
  });
  tx.signatures.push(decorated);
  return tx;
}
