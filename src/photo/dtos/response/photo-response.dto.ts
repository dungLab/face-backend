import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PhotoResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    description: '평가 기간',
  })
  span: number;

  @IsString()
  userNickName: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  hashTags: string[];
}
