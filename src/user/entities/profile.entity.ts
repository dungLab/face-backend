import { AbstractEntity } from '@/common/abstract-entity';
import { FileEntity } from '@/file/entities/file.entity';
import { UserEntity } from '@/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('uk_user_id', ['userId'], {
  unique: true,
})
@Entity('profiles')
export class ProfileEntity extends AbstractEntity {
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
    name: 'file_id',
    type: 'int',
    unsigned: true,
    comment: 'file id',
    nullable: true,
  })
  fileId?: number | null;

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

  @OneToOne(() => FileEntity, (file) => file.profile)
  @JoinColumn({
    name: 'file_id',
    referencedColumnName: 'id',
  })
  file: FileEntity;
}
