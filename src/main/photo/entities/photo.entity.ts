import { EvaluationEntity } from '@/main/evaluation/entities/evaluation.entity';
import { FileEntity } from '@/sub/file/entities/file.entity';
import { PhotoHashTagEntity } from '@/main/photo/entities/photo-hashtag.entity';
import { UserEntity } from '@/main/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('PHOTO')
export class PhotoEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    unsigned: true,
    comment: '유저 아이디',
  })
  userId: number;

  @Column({
    name: 'file_id',
    type: 'int',
    unsigned: true,
    comment: '파일 아이디',
  })
  fileId: number;

  @Column({ name: 'description', type: 'varchar', comment: 'description' })
  description: string;

  @Column({
    name: 'expired_at',
    type: 'datetime',
    comment: '사진 평가 만료 날짜',
  })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.photos)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_id',
  })
  user: UserEntity;

  @OneToMany(() => PhotoHashTagEntity, (photoHashTag) => photoHashTag.photo)
  photoHashTags: PhotoHashTagEntity[];

  //TODO: rename unique index name (REL_randomstr -> uk_file_id)
  @OneToOne(() => FileEntity, (file) => file.photo)
  @JoinColumn({
    name: 'file_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_file_id',
  })
  file: FileEntity;

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.photo)
  evaluations: EvaluationEntity[];
}
