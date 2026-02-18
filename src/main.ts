import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Документация проекта InPalm')
    .setDescription('Описание API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Введите токен следуя формату: Bearer <JWT>',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'jwt',
    )
    .addSecurityRequirements('jwt')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.use(
    '/photos',
    express.static(join(process.cwd(), 'photos'), {
      index: false,
    }),
  );

  app.use(
    '/videos',
    express.static(join(process.cwd(), 'videos'), {
      index: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
