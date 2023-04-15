import { FileType } from '@/file/constants';
import { PhotoEntity } from '@/photo/entities/photo.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/user/entities/user.entity';

@Entity('FILE')
export class FileEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'type', comment: '파일 타입 (image, docs, ..)' })
  type: FileType;

  @Column({ name: 'url', type: 'varchar', comment: 'obj url' })
  url: string;

  @Column({
    name: 'user_id',
    type: 'int',
    unsigned: true,
    comment: 'user id',
    nullable: true,
  })
  userId?: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToOne(() => PhotoEntity, (photo) => photo.file)
  photo: PhotoEntity;

  @OneToOne(() => UserEntity, (user) => user.file)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_id',
  })
  user: UserEntity;
}