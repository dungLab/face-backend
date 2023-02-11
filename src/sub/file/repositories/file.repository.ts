import { FileEntity } from '@/sub/file/entities/file.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FileEntity, dataSource.createEntityManager());
  }
}
