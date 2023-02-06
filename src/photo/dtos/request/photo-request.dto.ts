import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PhotoRequestDto {
  @Type(() => Number)
  @IsNumber()
  span: number;

  @IsString()
  description: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.split(',').map((_d) => String(_d).trim());
  })
  @IsArray()
  @IsOptional()
  hashTags?: string[];
}
