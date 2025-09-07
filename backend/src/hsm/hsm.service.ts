import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';
import { hsm } from '@dinamonetworks/hsm-dinamo';
import { PrismaService } from '../prisma/prisma.service';
import { version } from 'node:os';

@Injectable()
export class HsmService {
  private options: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.options = {
      host: this.configService.get('HSM_HOST'),
      authUsernamePassword: {
        username: this.configService.get('HSM_USER'),
        password: this.configService.get('HSM_PASS'),
      },
    };
  }

  private async hsmConnect() {
    return await hsm.connect(this.options);
  }

  async createNewUser(userId: string, password: string, permissions: string[]) {
    const c = await this.hsmConnect();
    console.log('HSM connected to create user');

    try {
      // Converte strings de permissões para enums do HSM
      const perms = permissions?.map(p => hsm.enums.USER_PERMISSIONS[p]) || [];

      const created = await c.user.create(userId, password, perms);

      if (created) {
        console.log(`User 👤"${userId}" created successfully`);

        // Salvar no banco de dados
        const user = await this.prisma.user.create({
          data: {
            userId,
            permissions,
          },
        });

        return {
          success: true,
          message: `User "${userId}" created successfully ✅`,
          user,
        };
      } else {
        console.log('User not created');
        return { success: false, message: 'User not created' };
      }
    } catch (err) {
      console.error('Error creating user:', err);
      return { error: err.message };
    } finally {
      await c.disconnect();
      console.log('HSM disconnected');
    }
  }

  async createKey(keyName: string, algorithm: string, exp: boolean, temp: boolean, userId: string) {
    const c = await this.hsmConnect();
    console.log('HSM connected to create key');

    try {
      // Ajuste para usar o enum correto e o método blockchain.create
      const algEnum = hsm.enums.BLOCKCHAIN_KEYS[algorithm] || hsm.enums.BLOCKCHAIN_KEYS.BIP32_XPRV;
      const version = hsm.enums.VERSION_OPTIONS.BIP32_MAIN_NET;

      console.log({ keyName, algEnum, exp, temp, version });

      // Cria a nova chave usando o método blockchain.create
      const created = await c.blockchain.create(
        keyName,    // Nome da chave
        algEnum,    // Tipo
        exp,        // Se é exportável
        temp,       // Se é temporária
        version     // Versão
      );

      if (created) {
        console.log(`Key 🔑"${keyName}" created successfully ✅`);

        // Buscar o usuário
        const user = await this.prisma.user.findUnique({
          where: { userId },
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Salvar no banco de dados
        const savedKey = await this.prisma.key.create({
          data: {
            keyName,
            algorithm: algorithm.toString(),
            exportable: exp,
            temp,
            userId: user.id,
          },
        });

        return {
          success: true,
          message: `Key "${keyName}" created successfully`,
          key: savedKey,
        };
      } else {
        console.log('Key not created ⛔');
        return { success: false, message: 'Key not created' };
      }
    } catch (err) {
      console.error('Error creating key:', err);
      return { error: err.message };
    } finally {
      await c.disconnect();
      console.log('HSM disconnected');
    }
  }

  async getPublicKeyRaw(keyId: string, exp?: string) {
    const c = await this.hsmConnect();
    try {
      let publicKey: Buffer;

      // HSM expects boolean for x509 format
      const useX509 = exp === 'x509' || exp === 'true';
      publicKey = await c.key.exportAsymmetricPub(keyId, useX509);

      // Atualizar a chave pública no banco se ainda não estiver armazenada
      const key = await this.prisma.key.findUnique({
        where: { keyName: keyId },
      });

      if (key && !key.publicKey) {
        await this.prisma.key.update({
          where: { keyName: keyId },
          data: { publicKey: publicKey.toString('base64') },
        });
      }

      return publicKey;
    } finally {
      await c.disconnect();
    }
  }

  async signEd25519(keyId: string, digest32: Buffer) {
    const c = await this.hsmConnect();
    try {
      // HSM DINAMO sign operation - adjust based on actual API
      // This is a common pattern for HSM signing operations
      const sig = await (c as any).crypto.sign(keyId, digest32);
      return sig;
    } finally {
      await c.disconnect();
    }
  }

  makeId(prefix = 'k'): string {
    return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
  }
}
