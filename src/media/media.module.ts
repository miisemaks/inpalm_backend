import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaService } from './media.service';
import { Media, MediaSchema } from './media.schema';
import { MediaController } from './media.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { UsersModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Media.name,
        schema: MediaSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
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
    UsersModule,
  ],
  controllers: [MediaController],
  providers: [MediaService, AuthMiddleware],
  exports: [MediaService],
})
export class MediaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'media/image',
        method: RequestMethod.POST,
      },
      {
        path: 'media/video',
        method: RequestMethod.POST,
      },
      {
        path: 'media/image/:id',
        method: RequestMethod.DELETE,
      },
      {
        path: 'media/user/:id',
        method: RequestMethod.GET,
      },
    );
  }
}
