import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
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
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @Length(1, 200, { each: true })
  @ApiProperty({ description: '해시태그들' })
  hashTags?: string[];
}
