import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SortType {
  ID = 'id',
  CREATED_AT = 'creaetdAt',
}

export enum FilterType {
  LIKE = 'like',
  DATE = 'date',
  EXAMINATION = 'examination',
}

class PaginationRequestDto {
  @IsNumber()
  pagesize: number;

  @IsEnum(SortType)
  sort: SortType = SortType.ID;
}

export class CursorPaginationRequestDto extends PaginationRequestDto {
  @IsOptional()
  endcursor?: string;
}

export class OffsetPaginationRequestDto extends PaginationRequestDto {
  @IsNumber()
  page: number;
}
