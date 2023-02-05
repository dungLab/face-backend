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
    description: '유저 가입 날짜',
  })
  createdAt: string;
}
