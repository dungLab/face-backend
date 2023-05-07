import { getDateFormat } from '@/common/utils/date.util';
import { FileType } from '@/file/constants';
import { FileReponseDto } from '@/file/dtos/request/file-response.dto';
import { FileMetaEntity } from '@/file/entities/file-meta.entity';
import { FileMetaRepository } from '@/file/repositories/file-meta.repository';
import { FileRepository } from '@/file/repositories/file.repository';
import { FolderType, S3BucketType } from '@/s3/constants';
import { S3Service } from '@/s3/s3.service';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { DataSource } from 'typeorm';

@Injectable()
export class FileService {
  static readonly FILE_SIZE: string[] = ['origin', 'w_256', 'w_1024'];

  constructor(
    //services
    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,

    //repositories
    private readonly fileRepository: FileRepository,
    private readonly fileMetaRepository: FileMetaRepository,
  ) {}

  async uploadImage(
    folderType: FolderType,
    image: Express.Multer.File,
  ): Promise<FileReponseDto> {
    const uploadedFileUrl = await this.s3Service.uploadAndGetUrl(
      image,
      S3BucketType.FACE,
      folderType,
    );

    const { file, metas } = await this.saveFile(
      FileType.IMAGE,
      uploadedFileUrl,
    );

    return Builder(FileReponseDto)
      .id(file.id)
      .type(file.type)
      .originalUrl(metas.find((d) => d.key === 'origin').value)
      .w256(metas.find((d) => d.key === 'w_256').value)
      .w1024(metas.find((d) => d.key === 'w_1024').value)
      .createdAt(getDateFormat(file.createdAt))
      .build();
  }

  async saveFile(type: FileType, url: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const fileEntity = this.fileRepository.create({
        type,
      });

      const savedFileEntity = await queryRunner.manager.save(fileEntity);
      const originUrlSplitArr = url.split('origin');

      const fileMetaEntities = FileService.FILE_SIZE.map(
        (key): FileMetaEntity => {
          const value = `${originUrlSplitArr[0]}${key}${originUrlSplitArr[1]}`;

          return this.fileMetaRepository.create({
            fileId: savedFileEntity.id,
            key,
            value,
          });
        },
      );

      const savedFileMetaEntities = await queryRunner.manager.save(
        fileMetaEntities,
      );

      await queryRunner.commitTransaction();

      return {
        file: savedFileEntity,
        metas: savedFileMetaEntities,
      };
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
    } finally {
      await queryRunner.release();
    }
  }
}
