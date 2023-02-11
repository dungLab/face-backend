import { HashTagEntity } from '@/main/photo/entities/hashtag.entity';
import { PhotoEntity } from '@/main/photo/entities/photo.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('PHOTO-HASHTAG')
export class PhotoHashTagEntity {
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

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
