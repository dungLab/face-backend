import { FILE_EXECUTOR_SERVICE_INJECT_TOKEN } from '@/common/constants/inject-token.constant';
import { getDateFormat } from '@/common/utils/date.util';
import { FileMetaType, FileType, FolderType } from '@/file/constants';
import { FileReponseDto } from '@/file/dtos/request/file-response.dto';
import { FileMetaRepository } from '@/file/repositories/file-meta.repository';
import { FileRepository } from '@/file/repositories/file.repository';
import { FileExecutorService } from '@/file/services/file-executor.service';
import { Inject, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { DataSource } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    //services
    @Inject(FILE_EXECUTOR_SERVICE_INJECT_TOKEN)
    private readonly fileExecutorService: FileExecutorService,
    private readonly dataSource: DataSource,

    //repositories
    private readonly fileRepository: FileRepository,
    private readonly fileMetaRepository: FileMetaRepository,
  ) {}

  async uploadImage(
    folderType: FolderType,
    image: Express.Multer.File,
  ): Promise<FileReponseDto> {
    const { url, publicId } = await this.fileExecutorService.upload(
      image,
      folderType,
    );

    const { file, metas } = await this.saveFile(FileType.IMAGE, url, publicId);

    return Builder(FileReponseDto)
      .id(file.id)
      .type(file.type)
      .url(metas.find((d) => d.key === FileMetaType.URL).value)
      .publicId(metas.find((d) => d.key === FileMetaType.PUBLIC_ID).value)
      .createdAt(getDateFormat(file.createdAt))
      .build();
  }

  async saveFile(type: FileType, url: string, publicId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const fileEntity = this.fileRepository.create({
        type,
      });

      const savedFileEntity = await queryRunner.manager.save(fileEntity);

      const fileMetaEntities = [
        this.fileMetaRepository.create({
          fileId: savedFileEntity.id,
          key: 'url',
          value: url,
        }),
        this.fileMetaRepository.create({
          fileId: savedFileEntity.id,
          key: 'public_id',
          value: publicId,
        }),
      ];

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
