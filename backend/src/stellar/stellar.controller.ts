import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StellarService } from './stellar.service';
import { HsmService } from '../hsm/hsm.service';
import { SignTransactionDto } from './dto/sign-transaction.dto';

@ApiTags('Stellar')
@Controller('stellar')
export class StellarController {
  constructor(
    private readonly stellarService: StellarService,
    private readonly hsmService: HsmService,
  ) {}

  @Post('sign')
  @ApiOperation({ summary: 'Sign transaction hash Stellar' })
  @ApiResponse({ status: 200, description: 'Transaction signed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid transaction hash' })
  @ApiResponse({ status: 500, description: 'Error signing transaction' })
  async signTransaction(@Body() signTransactionDto: SignTransactionDto) {
    try {
      const { keyId, txHashBase64 } = signTransactionDto;
      const digest32 = Buffer.from(txHashBase64, 'base64');

      if (digest32.length !== 32) {
        throw new HttpException(
          { error: 'txHash Invalid transaction hash (must be 32 bytes)' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const signature = await this.hsmService.signEd25519(keyId, digest32);

      // Salvar transação no banco de dados
      await this.stellarService.saveTransaction({
        keyId,
        txHash: txHashBase64,
        signature: signature.toString('base64'),
        sourceAccount: '', // Pode ser preenchido com mais informações se disponível
      });

      return { signatureBase64: signature.toString('base64') };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error in signTransaction:', error);
      throw new HttpException(
        { error: 'Error signing transaction tx', details: error?.message || error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
