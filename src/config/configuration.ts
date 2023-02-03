import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export function requireEnv<T = string>(
  key: string,
  mapper: (value: string) => T = (value) => value as unknown as T,
) {
  const value = process.env[key];
  if (value == null) {
    throw new Error(`Environment variable $${key} must be present.`);
  }

  return mapper(value);
}

/**
 * secret env values
 */
function getSecretConfiguration() {
  return {
    database: {
      host: requireEnv('DB_HOST'),
      port: requireEnv('DB_PORT'),
      username: requireEnv('DB_USERNAME'),
      schema: requireEnv('DB_SCHEMA'),
      password: requireEnv('DB_PASSWORD'),
    },
    kakao: {
      'admin-id': requireEnv('KAKAO_ADMIN_ID'),
      'client-id': requireEnv('KAKAO_CLIENT_ID'),
      'client-secret': requireEnv('KAKAO_CLIENT_SECRET'),
    },
    aws: {
      accessKey: requireEnv('ACCESS_KEY'),
      secretAccessKey: requireEnv('SECRET_ACCESS_KEY'),
    },
  };
}

/**
 * get config by env
 */
function getBaseConfigurationByEnv(environment: string) {
  switch (environment) {
    case 'production':
      return 'config-production.yaml';
    case 'development':
      return 'config-development.yaml';
    default:
      return 'config-local.yaml';
  }
}

export function configuration() {
  const baseEnvConfiguration = yaml.load(
    readFileSync(
      join(__dirname, getBaseConfigurationByEnv(process.env.NODE_ENV)),
      'utf8',
    ),
  ) as Record<string, any>;

  const sercretEnvConfiguartion = getSecretConfiguration();

  return Object.assign({}, baseEnvConfiguration, sercretEnvConfiguartion);
}
