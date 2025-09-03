import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'ID do usuário no HSM' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Permissões do usuário',
    example: ['LIST', 'READ', 'CREATE', 'DELETE'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
