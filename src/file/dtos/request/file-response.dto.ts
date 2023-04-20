import { FileType } from '@/file/constants';
import { ApiProperty } from '@nestjs/swagger';

export class FileReponseDto {
  @ApiProperty({
    description: '파일 id',
  })
  id: number;

  @ApiProperty({
    description: 'origin s3 url',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'width, height 256 resized s3 url',
  })
  w256: string;

  @ApiProperty({
    description: 'width, height 1024 resized s3 url',
  })
  w1024: string;

  @ApiProperty({
    description: 'file type (image, profile ..)',
  })
  type: FileType;

  @ApiProperty({ description: '파일 생성 날짜' })
  createdAt: string;
}
