import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const reqLog = {
        api: `${req.method} ${req.originalUrl}`,
        queryParams: req.query,
        bodyParams: req.body,
        statusCode: res.statusCode,
        header: JSON.stringify(req.headers),
        token: req.headers.authorization?.replace('Bearer ', '') ?? undefined,
      };

      Logger.log(reqLog);
      next();
    } catch (e) {
      Logger.error(e);
      next();
    }
  }
}
