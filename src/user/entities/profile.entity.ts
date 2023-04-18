import { UserEntity } from '@/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('PROFILE')
@Index('uk_user_id', ['userId'], {
  unique: true,
})
export class ProfileEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'user_id',
    type: 'int',
    unsigned: true,
    comment: 'user id',
  })
  userId: number;

  @Column({
    name: 'nickname',
    type: 'varchar',
    comment: '회원가입 시, 랜덤하게 생성',
  })
  nickName: string;

  @Column({
    name: 'introduction',
    type: 'varchar',
    comment: '자기소개 내용',
    length: 512,
    nullable: true,
  })
  introduction?: string | null;

  @Column({
    name: 'link',
    type: 'varchar',
    comment: '자기 소개 링크',
    length: 512,
    nullable: true,
  })
  link?: string | null;

  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
