import { CursorPaginationResponseDto } from '@/common/dtos/response/pagination-response.dto';
import { PhotoResponseDto } from '@/photo/dtos/response/photo-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoListResponseDto {
  @ApiProperty({
    type: PhotoResponseDto,
    description: '포토 데이터',
  })
  photos: PhotoResponseDto[];

  @ApiProperty({
    type: CursorPaginationResponseDto,
    description: '리스트 메타 데이터',
  })
  info: CursorPaginationResponseDto;
}
