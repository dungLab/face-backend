import { PhotoEntity } from '@/photo/entities/photo.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PhotoRepository extends Repository<PhotoEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PhotoEntity, dataSource.createEntityManager());
  }
  private _getBaseQueryBuilder() {
    return this.createQueryBuilder('photo');
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
      .leftJoinAndSelect('photo.user', 'user')
      .leftJoinAndSelect('photo.photoHashTags', 'photoHashTags')
      .leftJoinAndSelect('photoHashTags.hashTag', 'hashTag')
      .where('photo.userId = :userId', {
        userId,
      })
      .andWhere('photo.deletedAt is null')
      .orderBy('photo.id', 'DESC')
      .getMany();
  }

  async findOneById(id: number) {
    return await this._getBaseQueryBuilder()
      .leftJoinAndSelect('photo.user', 'user')
      .leftJoinAndSelect('photo.photoHashTags', 'photoHashTags')
      .leftJoinAndSelect('photoHashTags.hashTag', 'hashTag')
      .where('photo.id = :id', {
        id,
      })
      .andWhere('photo.deletedAt is null')
      .getOne();
  }
}
