import { ApiProperty } from '@nestjs/swagger';

export class UserReseponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  createdAt: string;
}
