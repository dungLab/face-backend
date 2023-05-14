import { UserEntity } from '@/user/entities/user.entity';
import { BaseEntity } from 'typeorm';

export type JwtPayload = Omit<UserEntity, keyof BaseEntity>;
