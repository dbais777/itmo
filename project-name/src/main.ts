import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const configuredPort = Number(process.env.PORT);
  const port = Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 3000;
  const nodeEnv = process.env.NODE_ENV ?? 'development';

  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Simple request logger for incoming HTTP requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });

  await app.listen(port);
  console.log(`Backend is running in ${nodeEnv} mode on port ${port}. [cache-test]`);
}
await bootstrap();
