import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    return `${process.env.NODE_ENV ?? 'local'} server is healthy`;
  }
}
