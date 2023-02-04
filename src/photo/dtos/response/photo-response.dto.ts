import { ApiProperty } from '@nestjs/swagger';

export class PhotoResponseDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  createdAt: string;
}
