import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Media, MediaSchema } from 'src/media/media.schema';
import { MediaService } from 'src/media/media.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'JWT_SECRET',
        signOptions: {
          expiresIn: +configService.get<string>('JWT_EXPIRES_IN', '24'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Media.name, schema: MediaSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthMiddleware, MediaService],
  exports: [UserService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'users/:id',
        method: RequestMethod.PUT,
      },
      {
        path: 'users/:id',
        method: RequestMethod.DELETE,
      },
      {
        path: 'users/me',
        method: RequestMethod.PUT,
      },
      {
        path: 'users/me',
        method: RequestMethod.GET,
      },
      {
        path: 'users/me/avatar',
        method: RequestMethod.PUT,
      },
      {
        path: 'users/me/avatar',
        method: RequestMethod.DELETE,
      },
    );
  }
}
