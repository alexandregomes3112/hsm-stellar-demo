// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createNewUser, createKey, getPublicKeyRaw, signEd25519 } from './hsm.js';
import { encodeG, addSignatureToTx } from './stellar.js';
import { hsm } from '@dinamonetworks/hsm-dinamo';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ——— HSM ————————————————————————————————————————————————————————

//Criar Partição
app.post('/hsm/user', async (req, res) => {
  try {
    const { userId, password, permissions } = req.body;
    const perms = permissions?.map((p) => hsm.enums.USER_PERMISSIONS[p]) || [];
    const result = await createNewUser({ userId, password, permissions: perms });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar partição', details: String(e?.message || e) });
  }
});

//Criar Chave
app.post('/hsm/keys', async (req, res) => {
  try {
    const { keyName, algorithm, exp, temp} = req.body;
    const alg = hsm.enums.ECX_ASYMMETRIC_SWITCHES[algorithm] || algorithm;
    const keyId  = await createKey({ keyName, algorithm: alg, exp, temp });
    res.json( keyId);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar chave', details: String(e?.message || e) });
  }
});

//Obter chave pública (raw)
app.get('/hsm/keys/:id/public', async (req, res) => {
  try {
    const keyId = req.params.id;
    let exp = req.query.exp;
    // Se exp for "false", undefined, null ou string vazia, não passe para o HSM
    if (!exp || exp === 'false') exp = undefined;
    const pub = await getPublicKeyRaw({ keyId, exp });
    const publicKeyG = encodeG(pub);
    res.json({ keyId, publicKey: pub.toString('base64'), publicKeyG });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao obter pública', details: String(e?.message || e) });
  }
});

// ——— Stellar ————————————————————————————————————————————————————
/**
 * Assina um hash de transação.
 * Body:
 *  - keyId: string
 *  - txHashBase64: string (32 bytes em base64)
 */
app.post('/stellar/sign', async (req, res) => {
  try {
    const { keyId, txHashBase64 } = req.body;
    const digest32 = Buffer.from(txHashBase64, 'base64');
    if (digest32.length !== 32) return res.status(400).json({ error: 'txHash inválido (precisa ter 32 bytes)' });

    const signature = await signEd25519({ keyId, digest32 }); // Buffer(64)
    res.json({ signatureBase64: signature.toString('base64') });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao assinar tx', details: String(e?.message || e) });
  }
});

const port = Number(process.env.PORT);
app.listen(port, () => {
  console.log(`✅ API running on http://localhost:${port}`);
});