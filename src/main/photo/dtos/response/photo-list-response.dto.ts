import { OffsetPaginationResponseDto } from '@/common/dtos/response/pagination-response.dto';
import { PhotoResponseDto } from '@/main/photo/dtos/response/photo-response.dto';

export class PhotoListResponseDto {
  photos: PhotoResponseDto[];

  info: OffsetPaginationResponseDto;
}
