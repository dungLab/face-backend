import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  //TODO: refreshToken
  // @ApiProperty()
  // refreshToken: string;
}
