import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Inpalm')
    .setDescription('Документация API бэкенда Inpalm')
    .setVersion('0.1')
    .addBearerAuth(
      {
        description: 'Введите токен следуя формату: Bearer <JWT>',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
      },
      'jwt',
    )
    .addSecurityRequirements('jwt')
    .build();
  app.useGlobalPipes(new ValidationPipe());

  const docOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return methodKey;
    },
  };

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, docOptions);

  SwaggerModule.setup('api/docs', app, documentFactory, {
    jsonDocumentUrl: 'api/docs-json',
    raw: ['json'],
    ui: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(
    '/api/docs-scalar',
    apiReference({
      content: documentFactory,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
