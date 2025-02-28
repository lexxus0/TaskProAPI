import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
// import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { createDir } from './utils/createDir';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './common/constants/app.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await createDir(TEMP_UPLOAD_DIR);
  await createDir(UPLOAD_DIR);

  const PORT = process.env.PORT ?? 8080;

  app.use(helmet());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.enableCors();

  // app.useLogger(app.get(Logger));

  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}

bootstrap();
