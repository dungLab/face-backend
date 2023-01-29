import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type CustomMysqlTypeOrmModuleOptionsType = TypeOrmModuleOptions & {
  synchronize: false;
};
