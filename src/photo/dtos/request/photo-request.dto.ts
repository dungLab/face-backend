import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PhotoRequestDto {
  @IsNumber()
  @ApiProperty({ description: 'file id' })
  fileId: number;

  @IsNumber()
  @ApiProperty({ description: '평가 기간(hour 기준)' })
  span: number;

  @IsString()
  @ApiProperty({ description: '평가 사진 설명' })
  description: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ description: '해시태그들' })
  hashTags?: string[];
}
