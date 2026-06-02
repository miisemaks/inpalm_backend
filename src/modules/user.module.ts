import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserEntity } from 'src/models/user.entity';
import { UsersService } from 'src/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
  controllers: [UserController],
  providers: [UsersService, AuthGuard],
  exports: [UsersService],
})
export class UserModule {}
