import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PhotoResponseDto {
  @ApiProperty({
    description: '사진 id',
  })
  id: number;

  @ApiProperty({
    description: '사진 s3 url',
  })
  url: string;

  @ApiProperty({
    description: '사진 설명',
  })
  description: string;

  @ApiProperty({
    description: '평가 기간',
  })
  span: number;

  @ApiProperty({
    description: '유저 닉네임',
  })
  @IsString()
  userNickName: string;

  @ApiProperty({
    description: '포토 생성 날짜',
  })
  createdAt: string;

  @ApiProperty({
    description: '포토의 해시태그들',
  })
  hashTags: string[];
}
