import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PhotoRequestDto {
  @Type(() => Number)
  @IsNumber()
  span: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  hashTag?: string;
}
