import { FileRepository } from '@/file/repositories/file.repository';
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileMetaRepository } from '@/file/repositories/file-meta.repository';
import { CloudinaryExecutorService } from '@/file/services/cloudinary-executor.service-impl';
import { FILE_EXECUTOR_SERVICE_INJECT_TOKEN } from '@/common/constants/inject-token.constant';

// file upload module
@Module({
  controllers: [FileController],
  providers: [
    FileService,
    FileRepository,
    FileMetaRepository,
    {
      provide: FILE_EXECUTOR_SERVICE_INJECT_TOKEN,
      useClass: CloudinaryExecutorService,
    },
  ],
  exports: [FileRepository],
})
export class FileModule {}
