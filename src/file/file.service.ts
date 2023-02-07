import { ErrorResponse } from '@/common/error-response.exception';
import { getDateFormat } from '@/common/utils/date.util';
import { FileType } from '@/file/constants';
import { FileReponseDto } from '@/file/dtos/request/file-response.dto';
import { FileRepository } from '@/file/repositories/file.repository';
import { ImageFolderType, S3BucketType } from '@/s3/constants';
import { S3Service } from '@/s3/s3.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';

@Injectable()
export class FileService {
  constructor(
    //services
    private readonly s3Service: S3Service,

    //repositories
    private readonly fileRepository: FileRepository,
  ) {}

  async uploadImage(
    type: ImageFolderType,
    image: Express.Multer.File,
  ): Promise<FileReponseDto> {
    switch (type) {
      case ImageFolderType.PHOTO: {
        // photo image upload
        const uploadedFileUrl = await this.s3Service.upload(
          image,
          'ap-northeast-2',
          S3BucketType.FACE,
          process.env.NODE_ENV === 'production'
            ? `${type}/production`
            : `${type}/development`,
        );

        const savedFileEntity = await this.fileRepository.save({
          type: FileType.IMAGE,
          url: uploadedFileUrl,
        });

        return Builder(FileReponseDto)
          .id(savedFileEntity.id)
          .type(savedFileEntity.type)
          .url(savedFileEntity.url)
          .createdAt(getDateFormat(savedFileEntity.createdAt))
          .build();
      }
      case ImageFolderType.PROFILE: {
        // profile image upload
        throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
          message: 'not defined image type',
          code: -1,
        });
      }
      default: {
        throw new ErrorResponse(HttpStatus.BAD_REQUEST, {
          message: 'not defined image type',
          code: -1,
        });
      }
    }
  }
}
