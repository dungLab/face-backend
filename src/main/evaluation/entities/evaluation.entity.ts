import { PhotoEntity } from '@/main/photo/entities/photo.entity';
import { UserEntity } from '@/main/user/entities/user.entity';
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

@Entity('EVALUATION')
export class EvaluationEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    unsigned: true,
    comment: '평가한 유저 아이디',
  })
  userId: number;

  @Column({
    name: 'photo_id',
    type: 'int',
    unsigned: true,
    comment: '포토 아이디',
  })
  photoId: number;

  @Column({
    name: 'is_good',
    type: 'boolean',
    unsigned: true,
    comment: '좋아요 여부',
  })
  isGood: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  //TODO: rename foreignkey index name (fk_photo_id_tmp -> fk_photo_id)
  @ManyToOne(() => PhotoEntity, (photo) => photo.evaluations)
  @JoinColumn({
    name: 'photo_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_photo_id_tmp',
  })
  photo: PhotoEntity;

  //TODO: rename foreignkey index name (fk_user_id_tmp -> fk_user_id)
  @ManyToOne(() => UserEntity, (user) => user.evaluations)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_id_tmp',
  })
  user: UserEntity;
}
