import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PhotoRequestDto {
  @IsNumber()
  @ApiProperty({ description: 'file id' })
  fileId: number;

  @IsPositive()
  @ApiProperty({ description: '평가 기간(ms 기준) (1이상 양수)' })
  span: number;

  @IsString()
  @ApiProperty({ description: '평가 사진 설명' })
  description: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ description: '해시태그들' })
  hashTags?: string[];
}
