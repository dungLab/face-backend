import { ApiProperty } from '@nestjs/swagger';

export class PhotoCreateInfoResponseDto {
  @ApiProperty({
    description: '평가기간 리스트',
    isArray: true,
    type: Number,
  })
  spans: number[];
}
