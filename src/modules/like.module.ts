import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from 'src/controllers/like.controller';
import { AuthGuard } from 'src/guard/auth.guard';
import { LikeEntity } from 'src/models/like.entity';
import { UserEntity } from 'src/models/user.entity';
import { LikesService } from 'src/services/like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity, UserEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
  controllers: [LikeController],
  providers: [LikesService, AuthGuard],
  exports: [LikesService],
})
export class LikeModule {}
