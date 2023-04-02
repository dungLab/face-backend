import { AppModule } from '@/app.module';
import { AllExceptionFilter } from '@/common/all-exception.filter';
import { setupSwagger } from '@/common/docs';
import { ResponseFormatInterceptor } from '@/common/interceptors/response-format.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  app.use(cookieParser());

  setupSwagger(app);

  //cors
  app.enableCors({
    origin: ['http://localhost:3030', 'https://d3nci1191iooos.cloudfront.net'],
    methods: 'GET, PUT, POST, PATCH, DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
