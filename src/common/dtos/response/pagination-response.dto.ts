import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

class PaginationResponseDto {
  @IsNumber()
  pageSize: number;

  @IsNumber()
  totalCount: number;
}

export class CursorPaginationResponseDto extends PaginationResponseDto {
  @IsOptional()
  endCursor: string | null;

  @IsBoolean()
  hasNextPage: boolean;
}

export class OffsetPaginationResponseDto extends PaginationResponseDto {
  @IsNumber()
  page: number;
}
