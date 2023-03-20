import { FileEntity } from '@/sub/file/entities/file.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FileEntity, dataSource.createEntityManager());
  }

  private _getBaseQueryBuilder(queryRunner?: QueryRunner) {
    return queryRunner
      ? this.createQueryBuilder('file', queryRunner)
      : this.createQueryBuilder('file');
  }

  async findById(id: number, queryRunner?: QueryRunner) {
    return await this._getBaseQueryBuilder(queryRunner)
      .withDeleted()
      .where('file.id = :id', {
        id,
      })
      .andWhere('file.deletedAt IS NULL')
      .getOne();
  }

  async findByUserId(userId: number, queryRunner?: QueryRunner) {
    return await this._getBaseQueryBuilder(queryRunner)
      .withDeleted()
      .where('file.userId = :userId', {
        userId,
      })
      .andWhere('file.deletedAt IS NULL')
      .getOne();
  }
}
