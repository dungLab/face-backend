import { PhotoEntity } from '@/photo/entities/photo.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class PhotoRepository extends Repository<PhotoEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PhotoEntity, dataSource.createEntityManager());
  }
  private _getBaseQueryBuilder(queryRunner?: QueryRunner) {
    return queryRunner
      ? this.createQueryBuilder('photo', queryRunner)
      : this.createQueryBuilder('photo');
  }

  async insertOne(value: Partial<PhotoEntity>) {
    return await this._getBaseQueryBuilder()
      .insert()
      .into(PhotoEntity)
      .values(value)
      .execute();
  }

  async insertBatch(values: Partial<PhotoEntity>[]) {
    return await this._getBaseQueryBuilder()
      .insert()
      .into(PhotoEntity)
      .values(values)
      .execute();
  }

  async findManyCursorByUserId(userId: number) {
    return await this._getBaseQueryBuilder()
      .withDeleted()
      .leftJoinAndSelect('photo.user', 'user')
      .leftJoinAndSelect('photo.file', 'file')
      .leftJoinAndSelect('photo.photoHashTags', 'photoHashTags')
      .leftJoinAndSelect('photoHashTags.hashTag', 'hashTag')
      .where('photo.userId = :userId', {
        userId,
      })
      .andWhere('photo.deletedAt IS NULL')
      .orderBy('photo.id', 'DESC')
      .getMany();
  }

  async findOneById(id: number) {
    return await this._getBaseQueryBuilder()
      .withDeleted()
      .leftJoinAndSelect('photo.user', 'user')
      .leftJoinAndSelect('photo.file', 'file')
      .leftJoinAndSelect('photo.photoHashTags', 'photoHashTags')
      .leftJoinAndSelect('photoHashTags.hashTag', 'hashTag')
      .where('photo.id = :id', {
        id,
      })
      .andWhere('photo.deletedAt IS NULL')
      .getOne();
  }

  // select id, user_id
  async findSimpleOneById(id: number) {
    return await this._getBaseQueryBuilder()
      .withDeleted()
      .select(['photo.id', 'photo.userId'])
      .where('photo.id = :id', {
        id,
      })
      .andWhere('photo.deletedAt IS NULL')
      .limit(1)
      .getOne();
  }

  async findOneForEvaluation(requestUserId: number) {
    return await this._getBaseQueryBuilder()
      .withDeleted()
      .select('photo.id')
      .leftJoin(
        'photo.evaluations',
        'evaluations',
        'evaluations.userId = :requestUserId',
        {
          requestUserId,
        },
      )
      .where('photo.userId <> :requestUserId', { requestUserId })
      .andWhere('photo.expiredAt > NOW()')
      .andWhere('photo.deletedAt IS NULL')
      .andWhere('evaluations.id IS NULL')
      .orderBy('photo.expiredAt', 'ASC')
      .getOne();
  }
}
