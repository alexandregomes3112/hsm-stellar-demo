import crypto from 'node:crypto';
import { hsm } from "@dinamonetworks/hsm-dinamo";
import 'dotenv/config';

const options = {
  host: process.env.HSM_HOST,
  authUsernamePassword: {
    username: process.env.HSM_USER,
    password: process.env.HSM_PASS,
  },
};

// Middleware para conectar ao HSM
async function hsmConnect() {
  return await hsm.connect(options);
}


// Cria usuário no HSM
export async function createNewUser({ userId, password, permissions }) {
  const c = await hsmConnect();
  console.log("HSM connected to create user");

  try {
    const created = await c.user.create(userId, password, permissions);

    if (created) {
      console.log(`User 👤"${userId}" created successfully 👍🏻🎯⭐✅🎊`);
      return { success: true, message: `User "${userId}" created successfully` };
      
    } else {
      console.log("User not created 💩🚽🚫❌⛔");
      return { success: false, message: "User not created" };
      
    }
  } catch (err) {
    return { error: err.message };
  } finally {
    await c.disconnect();
    console.log("HSM disconnected");
  }
}

/** Cria chave em uma partição */ ;
export async function createKey({ keyName, algorithm, exp, temp }) {
  const c = await hsmConnect();
  console.log("HSM connected to create key");

  try{
    const key = await c.key.create(keyName, algorithm, exp, temp);
    
    if (key) {
      console.log(`Key 🔑"${keyName}" created successfully 👍🏻🎯⭐✅🎊`);
      return { success: true, message: `Key "${keyName}" created successfully`};
    } else {
      console.log("Key not created 💩🚽🚫❌⛔");
      return { success: false, message: "Key not created" };
    }
  } catch (err) {
    return { error: err.message };
  } finally {
    await c.disconnect();
    console.log("HSM disconnected");
  }

}

/** Obtém a chave pública (32 bytes) */
export async function getPublicKeyRaw({ keyId, exp }) {
  const c = await hsmConnect();
  try {
    if (typeof exp === 'string' && exp.length > 0) {
      return await c.key.exportAsymmetricPub(keyId, exp);
    } else {
      return await c.key.exportAsymmetricPub(keyId);
    }
  } finally {
    await c.disconnect();
  }
}

/** Assina (ED25519) o hash de 32 bytes da transação Stellar */
export async function signEd25519({ keyId, digest32 }) {
  const c = await hsmConnect();
  // EXEMPLO: ajuste p/ chamadas reais
  // Alguns HSMs recebem "message" e fazem Ed25519 (pure). Envie o hash (32 bytes) como "message".
  const sig = await c.sign.ed25519({ keyId, message: digest32 }); // retorna Buffer (64 bytes)
  return sig;
}

/** Utilitário opcional para gerar um ID "legível" de chave/partição quando o HSM não fornece */
export function makeId(prefix = 'k') {
  return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
}

