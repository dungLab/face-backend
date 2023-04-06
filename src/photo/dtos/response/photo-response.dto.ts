import { UserReseponseDto } from '@/user/dtos/response/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

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
    description: '평가 만료 기간',
  })
  expiredAt: string;

  @ApiProperty({
    type: UserReseponseDto,
    description: '포토 소유 유저',
  })
  user: UserReseponseDto;

  @ApiProperty({
    description: '포토 생성 날짜',
  })
  createdAt: string;

  @ApiProperty({
    description: '포토의 해시태그들',
  })
  hashTags: string[];

  @ApiProperty({
    type: String,
    nullable: true,
  })
  likePercentage: string | null;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  viewCount: number | null;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  likeCount: number | null;

  @ApiProperty({
    type: Number,
    nullable: true,
  })
  hateCount: number | null;
}
