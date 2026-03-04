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
import AdminModule from './admin/admin.module.js';

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
    AdminModule,
  ],
})
export class AppModule {}
