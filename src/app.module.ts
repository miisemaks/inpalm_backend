import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { PublicationModule } from './modules/publication.module';
import { LikeModule } from './modules/like.module';
import { JwtModule } from '@nestjs/jwt';
import { SubscribeModule } from './modules/subscribe.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    PublicationModule,
    LikeModule,
    SubscribeModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
