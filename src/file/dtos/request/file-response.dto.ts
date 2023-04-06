import { FileType } from '@/file/constants';
import { ApiProperty } from '@nestjs/swagger';

export class FileReponseDto {
  @ApiProperty({
    description: '파일 id',
  })
  id: number;

  @ApiProperty({
    description: '파일 s3 url',
  })
  url: string;

  @ApiProperty({
    description: 'file type (image, profile ..)',
  })
  type: FileType;

  @ApiProperty({ description: '파일 생성 날짜' })
  createdAt: string;
}
