import { CustomMysqlTypeOrmModuleOptionsType } from '@/common/types/ormconfig.type';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const ormconfig = (
  config: ConfigService,
): CustomMysqlTypeOrmModuleOptionsType => {
  return {
    // base
    type: 'mysql',
    synchronize: false,
    retryAttempts: 10,
    retryDelay: 1000,
    logging:
      process.env.NODE_ENV === 'production'
        ? ['warn', 'error']
        : ['log', 'warn', 'error', 'query'],
    keepConnectionAlive: true,
    extra: {
      connectionLimit: process.env.NODE_ENV === 'production' ? 500 : 50,
      charset: 'utf8mb4_unicode_ci',
    },
    bigNumberStrings: false,
    autoLoadEntities: false,

    // specific
    host: config.get<string>('database.host'),
    port: config.get<number>('database.port'),
    username: config.get<string>('database.username'),
    database: config.get<string>('database.schema'),
    password: config.get<string>('database.password'),
    entities: [join(__dirname, '../../', '/**/entities/*.entity{.ts,.js}')],
  };
};
