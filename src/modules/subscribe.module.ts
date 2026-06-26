import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribeController } from 'src/controllers/subscribe.controller';
import { AuthGuard } from 'src/guard/auth.guard';
import { SubscribeEntity } from 'src/models/subscribe.entity';
import { UserEntity } from 'src/models/user.entity';
import { SubscribesService } from 'src/services/subscribe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscribeEntity, UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
  controllers: [SubscribeController],
  providers: [SubscribesService, AuthGuard],
  exports: [SubscribesService],
})
export class SubscribeModule {}
