import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @ApiProperty({
    description: 'refresh token(string)',
  })
  refreshToken: string;
}
