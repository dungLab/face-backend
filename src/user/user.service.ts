import { OAuthServiceType } from '@/auth/constants';
import { getDateFormat } from '@/common/utils/date.util';
import { UserReseponseDto } from '@/user/dtos/response/user-response.dto';
import { UserEntity } from '@/user/entities/user.entity';
import { UserRepository } from '@/user/repositories/user.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { UpdateUserDto } from '@/user/dtos/request/update-user.dto';
import { FileRepository } from '@/file/repositories/file.repository';
import { ErrorResponse } from '@/common/error-response.exception';
import { DataSource } from 'typeorm';
import { ProfileRepository } from '@/user/repositories/profile.repository';
import { generateRandomNickName } from '@/user/utils';
import { FileReponseDto } from '@/file/dtos/request/file-response.dto';

@Injectable()
export class UserService {
  constructor(
    //services
    private readonly dataSource: DataSource,

    // repositories
    private readonly userRepository: UserRepository,
    private readonly fileRepository: FileRepository,
    private readonly profileRepository: ProfileRepository,
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

  async createUser(email: string, type: OAuthServiceType): Promise<UserEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const createdUser = this.userRepository.create({
        email,
        type,
      });

      // user
      const savedUserEntity = await queryRunner.manager.save(createdUser);

      // profile
      const createdProfile = this.profileRepository.create({
        userId: savedUserEntity.id,
        nickName: generateRandomNickName(),
      });

      await queryRunner.manager.save(createdProfile);

      await queryRunner.commitTransaction();

      return savedUserEntity;
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
    } finally {
      await queryRunner.release();
    }
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
      .nickName(foundUserEntity.profile.nickName)
      .introduction(foundUserEntity.profile.introduction)
      .link(foundUserEntity.profile.link)
      .image(
        foundUserEntity.profile.file
          ? Builder(FileReponseDto)
              .id(foundUserEntity.profile.file.id)
              .type(foundUserEntity.profile.file.type)
              .originalUrl(
                foundUserEntity.profile.file.metas.find(
                  (d) => d.key === 'origin',
                ).value,
              )
              .w256(
                foundUserEntity.profile.file.metas.find(
                  (d) => d.key === 'w_256',
                ).value,
              )
              .w1024(
                foundUserEntity.profile.file.metas.find(
                  (d) => d.key === 'w_1024',
                ).value,
              )
              .createdAt(getDateFormat(foundUserEntity.profile.file.createdAt))
              .build()
          : null,
      )
      .createdAt(getDateFormat(foundUserEntity.createdAt))
      .build();
  }

  async update(user: UserEntity, updateUserDto: UpdateUserDto) {
    const { nickName, introduction, link, fileId } = updateUserDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      if (fileId) {
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

      const updatedProfile = this.profileRepository.create({
        ...foundUserEntity.profile,
        nickName,
        introduction,
        link,
        fileId,
      });

      await queryRunner.manager.save(updatedProfile);

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
