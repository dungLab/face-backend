import { AppModule } from '@/app.module';
import { AllExceptionFilter } from '@/common/all-exception.filter';
import { ResponseFormatInterceptor } from '@/common/response-format.interceptor';
import { setupSwagger } from '@/docs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.use(cookieParser());

  setupSwagger(app);

  //cors
  app.enableCors({
    origin: ['http://localhost:3030'],
    methods: 'GET, PUT, POST, PATCH, DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
