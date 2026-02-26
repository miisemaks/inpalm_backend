import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import * as AdminJSExpress from '@adminjs/express';
import mongoose from 'mongoose';
import { User } from './user/user.entity.js';

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/inpalm',
  );

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

  const adminjs = new AdminJS({
    resources: [User],
    // databases: [process.env.MONGODB_URI || 'mongodb://localhost:27017/inpalm'],
  });
  const router = AdminJSExpress.buildRouter(adminjs);

  app.use('/admin', router);

  await app.listen(process.env.PORT ?? 3000);

  await adminjs.watch();
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
