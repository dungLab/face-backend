import { configuration } from '@/common/config/configuration';
import { CustomMysqlTypeOrmModuleOptionsType } from '@/common/types/ormconfig.type';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

const config = new ConfigService(configuration());

export const ormconfig: CustomMysqlTypeOrmModuleOptionsType = {
  // base
  type: 'mysql',
  synchronize: false,
  retryAttempts: 0,
  retryDelay: 300,
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
