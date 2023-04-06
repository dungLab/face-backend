import { ApiProperty } from '@nestjs/swagger';

export class UserReseponseDto {
  @ApiProperty({
    description: '유저 id',
  })
  id: number;

  @ApiProperty({
    description: '유저 email',
  })
  email: string;

  @ApiProperty({
    description: '유저 닉네임',
  })
  nickName: string;

  @ApiProperty({
    description: '유저 자기소개',
  })
  introduction: string | null;

  @ApiProperty({
    description: '유저 sns link',
  })
  link: string | null;

  @ApiProperty({
    description: '대표 프로필 url',
  })
  url: string | null;

  @ApiProperty({
    description: '유저 가입 날짜',
  })
  createdAt: string;
}
