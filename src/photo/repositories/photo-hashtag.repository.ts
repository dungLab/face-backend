import { PhotoHashTagEntity } from '@/photo/entities/photo-hashtag.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PhotoHashTagRepository extends Repository<PhotoHashTagEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PhotoHashTagEntity, dataSource.createEntityManager());
  }
}
