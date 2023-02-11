import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/main/auth/auth.module';
import { configuration } from '@/common/config/configuration';
import { ormconfig } from '@/common/config/ormconfig';
import { HttpModule } from '@/sub/http/http.module';
import { PhotoModule } from '@/main/photo/photo.module';
import { S3Module } from '@/sub/s3/s3.module';
import { UserModule } from '@/main/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './sub/file/file.module';
import { EvaluationModule } from './main/evaluation/evaluation.module';
import { LogModule } from './sub/log/log.module';
@Module({
  imports: [
    // config module should load first
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    // typeorm module
    TypeOrmModule.forRootAsync({ useFactory: () => ormconfig }),

    // http module
    HttpModule,

    AuthModule,

    UserModule,

    PhotoModule,

    S3Module,

    FileModule,

    EvaluationModule,

    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
