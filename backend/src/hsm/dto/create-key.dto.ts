import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateKeyDto {
  @ApiProperty({ description: 'Nome da chave' })
  @IsString()
  keyName: string;

  @ApiProperty({
    description: 'Algoritmo da chave',
    example: 'ALG_EC_ED25519',
  })
  @IsString()
  algorithm: string;

  @ApiProperty({
    description: 'Se a chave pode ser exportada',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  exp?: boolean = false;

  @ApiProperty({
    description: 'Se a chave é temporária',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  temp?: boolean = false;

  @ApiProperty({ description: 'ID do usuário proprietário da chave' })
  @IsString()
  userId: string;
}
