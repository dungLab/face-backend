import { AbstractEntity } from '@/common/abstract-entity';
import { HashTagEntity } from '@/photo/entities/hashtag.entity';
import { PhotoEntity } from '@/photo/entities/photo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('photo_hashtags')
export class PhotoHashTagEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'hashtag_id',
    type: 'int',
    unsigned: true,
    comment: 'hashtag fk',
  })
  hashTagId: number;

  @Column({
    name: 'photo_id',
    type: 'int',
    unsigned: true,
    comment: 'photo fk',
  })
  photoId: number;

  @ManyToOne(() => PhotoEntity, (photo) => photo.photoHashTags)
  @JoinColumn({
    name: 'photo_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_photo_id',
  })
  photo: PhotoEntity;

  @ManyToOne(() => HashTagEntity, (hashTag) => hashTag.photoHashTags)
  @JoinColumn({
    name: 'hashtag_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_hashtag_id',
  })
  hashTag: HashTagEntity;
}
