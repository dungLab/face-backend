import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationRequestDto {
  @ApiProperty({
    description: '페이지 사이즈',
  })
  @Type(() => Number)
  @IsNumber()
  pageSize: number;
}

export class CursorPaginationRequestDto extends PaginationRequestDto {
  @IsOptional()
  endcursor?: string;
}

export class OffsetPaginationRequestDto extends PaginationRequestDto {
  @IsNumber()
  page: number;
}
