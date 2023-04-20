import { FileMetaEntity } from '@/file/entities/file-meta.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FileMetaRepository extends Repository<FileMetaEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FileMetaEntity, dataSource.createEntityManager());
  }
}
