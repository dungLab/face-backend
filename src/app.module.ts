import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { configuration } from '@/config/configuration';
import { ormconfig } from '@/config/ormconfig';
import { HttpModule } from '@/http/http.module';
import { PhotoModule } from '@/photo/photo.module';
import { S3Module } from '@/s3/s3.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { EvaluationModule } from './evaluation/evaluation.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
