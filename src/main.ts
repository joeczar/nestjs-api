import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import * as session from 'express-session';
import { Logger } from '@nestjs/common';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(
    csrf({
      sessionKey: process.env.SESSION_SECRET,
    }),
  );
  await app.listen(port);
  Logger.log(`Server started running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
