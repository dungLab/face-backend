import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @ApiProperty({ description: '닉네임' })
  @Length(1, 255)
  nickName: string;

  @ValidateIf((object, value) => value !== null)
  @IsString()
  @ApiProperty({ description: '간단한 자기소개' })
  @Length(1, 512)
  introduction: string | null;

  @ValidateIf((object, value) => value !== null)
  @IsString()
  @ApiProperty({
    description: '자기소개 링크 주소(ex) 인스타 주소, 페북, 노션..)',
  })
  @Length(1, 512)
  link: string | null;

  @ValidateIf((object, value) => value !== null)
  @IsNumber()
  @ApiProperty({
    description:
      'file id - 프로필 이미지 제거하고싶으면 fileId에 null보내시면 됩니다.',
  })
  fileId: number | null;
}
