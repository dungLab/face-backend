import { FileRepository } from '@/file/repositories/file.repository';
import { S3Module } from '@/s3/s3.module';
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

// file upload module
@Module({
  imports: [S3Module],
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileRepository],
})
export class FileModule {}