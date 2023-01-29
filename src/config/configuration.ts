import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

function getConfigFileNameByEnvironment(environment: string) {
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
  const conf = yaml.load(
    readFileSync(
      join(__dirname, getConfigFileNameByEnvironment(process.env.NODE_ENV)),
      'utf8',
    ),
  ) as Record<string, any>;

  return {
    ...conf,
    database: {
      ...conf.database,
      password: conf?.database?.password ?? process.env.DB_PASSWORD,
    },
  };
}
