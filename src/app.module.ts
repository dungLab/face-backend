import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { configuration } from '@/config/configuration';
import { ormconfig } from '@/config/ormconfig';
import { HttpModule } from '@/http/http.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    // config module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // typeorm module
    TypeOrmModule.forRootAsync({ useFactory: () => ormconfig }),

    // http module
    HttpModule,

    AuthModule,

    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}