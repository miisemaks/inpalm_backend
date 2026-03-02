import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user/user.module.js';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { FirebaseModule } from './firebase/firebase.module.js';
import { PublicationModule } from './publication/publication.module.js';
import { MediaModule } from './media/media.module.js';
import { MulterModule } from '@nestjs/platform-express';
import { User } from './user/user.schema.js';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJS from 'adminjs';
import { dark, light } from '@adminjs/themes';

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/inpalm',
      {
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () =>
            console.log('connected', process.env.MONGODB_URI),
          );
          connection.on('open', () => console.log('open'));
          connection.on('disconnected', () => console.log('disconnected'));
          connection.on('reconnected', () => console.log('reconnected'));
          connection.on('disconnecting', () => console.log('disconnecting'));

          return connection;
        },
        bufferCommands: false,
        timeoutMS: 60000,
        connectTimeoutMS: 30000,
        maxPoolSize: 2,
        minPoolSize: 2,
      },
    ),
    ConfigModule.forRoot(),
    FirebaseModule,
    UsersModule,
    AuthModule,
    PublicationModule,
    MediaModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: '../photos',
      }),
    }),
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => {
          const Database = AdminJSMongoose.Database;
          const Resource = AdminJSMongoose.Resource;

          AdminJS.registerAdapter({ Database, Resource });

          return {
            adminJsOptions: {
              settings: {
                defaultPerPage: 20,
              },
              branding: {
                companyName: 'inpalm',
              },
              rootPath: '/admin',
              defaultTheme: dark.id,
              availableThemes: [dark, light],
              resources: [
                {
                  resource: User,
                  options: {
                    navigation: {
                      name: 'User',
                      icon: 'User',
                    },
                    properties: {},
                    listProperties: ['email', 'firstName', 'lastName', 'role'],
                  },
                },
              ],
            },
            auth: {
              authenticate,
              cookieName: 'adminjs',
              cookiePassword: 'secret',
            },
            sessionOptions: {
              resave: true,
              saveUninitialized: true,
              secret: 'secret',
            },
          };
        },
      }),
    ),
  ],
})
export class AppModule {}
