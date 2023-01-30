import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('USER')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'nickname',
    type: 'varchar',
    comment: '회원가입 시, 랜덤하게 생성',
  })
  nickName: string;

  @Column({
    name: 'type',
    type: 'varchar',
    comment: '유저 타입 (kakao, naver, google, apple)',
  })
  type: string;

  // TODO: refreshToken 고정된 문자열의 길이이면 char(length) 로 변경
  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
