import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthMiddleware],
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
    );
  }
}
