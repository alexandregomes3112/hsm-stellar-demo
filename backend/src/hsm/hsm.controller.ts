import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HsmService } from './hsm.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateKeyDto } from './dto/create-key.dto';
import { StellarService } from '../stellar/stellar.service';
import { hsm } from '@dinamonetworks/hsm-dinamo';

@ApiTags('HSM')
@Controller('hsm')
export class HsmController {
  constructor(
    private readonly hsmService: HsmService,
    private readonly stellarService: StellarService,
  ) {}

  @Post('user')
  @ApiOperation({ summary: 'Create user/partition in HSM' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 500, description: 'Error creating user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.hsmService.createNewUser(
        createUserDto.userId,
        createUserDto.password,
        createUserDto.permissions || [],
      );

      if (result.error) {
        throw new HttpException(
          { error: 'Error creating partition', details: result.error },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new HttpException(
        { error: 'Error creating partition', details: error?.message || error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('keys')
  @ApiOperation({ summary: 'Create ED25519 key in HSM' })
  @ApiResponse({ status: 201, description: 'Key created successfully' })
  @ApiResponse({ status: 500, description: 'Error creating key' })
  async createKey(@Body() createKeyDto: CreateKeyDto) {
    try {
      // Converter algoritmo se necessário
      const alg =
        hsm.enums.ECX_ASYMMETRIC_SWITCHES[createKeyDto.algorithm] || createKeyDto.algorithm;

      const result = await this.hsmService.createKey(
        createKeyDto.keyName,
        alg,
        createKeyDto.exp || false,
        createKeyDto.temp || false,
        createKeyDto.userId,
      );

      if (result.error) {
        throw new HttpException(
          { error: 'Error creating key', details: result.error },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      console.error('Error in createKey:', error);
      throw new HttpException(
        { error: 'Error creating key', details: error?.message || error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('keys/:id/public')
  @ApiOperation({ summary: 'Get public key of a key' })
  @ApiQuery({ name: 'exp', required: false, description: 'Export for specific format' })
  @ApiResponse({ status: 200, description: 'Public key obtained successfully' })
  @ApiResponse({ status: 500, description: 'Error getting public key' })
  async getPublicKey(@Param('id') keyId: string, @Query('exp') exp?: string) {
    try {
      // Se exp for "false", undefined, null ou string vazia, não passe para o HSM
      if (!exp || exp === 'false') {
        exp = undefined;
      }

      const pub = await this.hsmService.getPublicKeyRaw(keyId, exp);
      const publicKeyG = this.stellarService.encodeG(pub);

      return {
        keyId,
        publicKey: pub.toString('base64'),
        publicKeyG,
      };
    } catch (error) {
      console.error('Error in getPublicKey:', error);
      throw new HttpException(
        { error: 'Error getting public key', details: error?.message || error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
