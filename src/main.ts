import { AppModule } from '@/app.module';
import { AllExceptionFilter } from '@/common/all-exception.filter';
import { ResponseFormatInterceptor } from '@/common/response-format.interceptor';
import { setupSwagger } from '@/docs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());

  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
