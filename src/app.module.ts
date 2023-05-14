import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { configuration } from '@/common/config/configuration';
import { ormconfig } from '@/common/config/ormconfig';
import { HttpModule } from '@/http/http.module';
import { PhotoModule } from '@/photo/photo.module';
import { UserModule } from '@/user/user.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { LogModule } from './log/log.module';
import { LoggerMiddleware } from '@/common/middlewares/logger.middleware';
@Module({
  imports: [
    // config module should load first
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    // typeorm module
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ormconfig(config),
    }),

    // http module
    HttpModule,

    AuthModule,

    UserModule,

    PhotoModule,

    FileModule,

    EvaluationModule,

    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
