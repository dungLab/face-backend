import { OAuthServiceType } from '@/main/auth/constants';
import { getDateFormat } from '@/common/utils/date.util';
import { UserReseponseDto } from '@/main/user/dtos/response/user-response.dto';
import { UserEntity } from '@/main/user/entities/user.entity';
import { UserRepository } from '@/main/user/repositories/user.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { UpdateUserDto } from '@/main/user/dtos/request/update-user.dto';
import { FileRepository } from '@/sub/file/repositories/file.repository';
import { ErrorResponse } from '@/common/error-response.exception';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    //services
    private readonly dataSource: DataSource,

    // repositories
    private readonly userRepository: UserRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  async findById(id: number) {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findByKakaoEmail(email: string) {
    return await this.userRepository.findByEmailAndType(
      email,
      OAuthServiceType.KAKAO,
    );
  }

  async getUserInfo(user: UserEntity): Promise<UserReseponseDto> {
    const foundUserEntity = await this.userRepository.findWithFileById(user.id);

    if (!foundUserEntity) {
      throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'there is no user by id',
        code: -1,
      });
    }
    return Builder(UserReseponseDto)
      .id(foundUserEntity.id)
      .email(foundUserEntity.email)
      .nickName(foundUserEntity.nickName)
      .introduction(foundUserEntity.introduction)
      .link(foundUserEntity.link)
      .url(foundUserEntity.file?.url ?? null)
      .createdAt(getDateFormat(foundUserEntity.createdAt))
      .build();
  }

  async update(user: UserEntity, updateUserDto: UpdateUserDto) {
    const { nickName, introduction, link, fileId } = updateUserDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      if (!fileId) {
        // 없애려면
        const foundFileEntity = await this.fileRepository.findByUserId(
          user.id,
          queryRunner,
        );

        if (foundFileEntity) {
          const updateFile = this.fileRepository.create({
            ...foundFileEntity,
            userId: null,
          });

          await queryRunner.manager.save(updateFile);
        }
      } else {
        //추가하려면
        const foundFileEntity = await this.fileRepository.findById(
          fileId,
          queryRunner,
        );

        if (!foundFileEntity) {
          throw new ErrorResponse(HttpStatus.NOT_FOUND, {
            message: 'there is no file by id',
            code: -1,
          });
        }

        const updateFile = this.fileRepository.create({
          ...foundFileEntity,
          userId: user.id,
        });

        await queryRunner.manager.save(updateFile);
      }

      // user처리
      const foundUserEntity = await this.userRepository.findById(
        user.id,
        queryRunner,
      );

      if (!foundUserEntity) {
        throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: 'there is no user by token',
          code: -1,
        });
      }

      const updateUser = this.userRepository.create({
        ...foundUserEntity,
        nickName,
        introduction,
        link,
      });

      await queryRunner.manager.save(updateUser);

      await queryRunner.commitTransaction();
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw err;
    } finally {
      await queryRunner.release();
    }

    return true;
  }
}
