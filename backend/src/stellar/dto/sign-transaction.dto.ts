import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignTransactionDto {
  @ApiProperty({ description: 'ID of the key in HSM' })
  @IsString()
  keyId: string;

  @ApiProperty({
    description: 'Transaction hash in base64 (32 bytes)',
    example: 'base64EncodedHashHere',
  })
  @IsString()
  txHashBase64: string;
}
