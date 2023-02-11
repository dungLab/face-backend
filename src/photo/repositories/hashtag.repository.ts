import { HashTagEntity } from '@/photo/entities/hashtag.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class HashTagReository extends Repository<HashTagEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(HashTagEntity, dataSource.createEntityManager());
  }

  private _getBaseQueryBuilder(queryRunner?: QueryRunner) {
    return queryRunner
      ? this.createQueryBuilder('hashtag', queryRunner)
      : this.createQueryBuilder('hashtag');
  }

  async findManyByNames(names: string[], queryRunner: QueryRunner) {
    return this._getBaseQueryBuilder(queryRunner)
      .withDeleted()
      .where('hashtag.name IN (:names)', {
        names,
      })
      .andWhere('hashtag.deletedAt IS NULL')
      .getMany();
  }
}
