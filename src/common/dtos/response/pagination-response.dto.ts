import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

class PaginationResponseDto {
  @ApiProperty({
    description: '페이지 사이즈',
  })
  @IsNumber()
  pageSize: number;

  @ApiProperty({
    description: '전체 개수',
  })
  @IsNumber()
  totalCount: number;
}

export class CursorPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    description: '마지막 커서',
  })
  @IsOptional()
  endCursor: string | null;

  @ApiProperty({
    description: '다음페이지 존재 여부',
  })
  @IsBoolean()
  hasNextPage: boolean;
}

export class OffsetPaginationResponseDto extends PaginationResponseDto {
  @ApiProperty({
    description: '현재 페이지 번호',
  })
  @IsNumber()
  page: number;
}
