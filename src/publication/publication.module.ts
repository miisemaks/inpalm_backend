import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicationService } from './publication.service';
import { Publication, PublicationSchema } from './publication.schema';
import { PublicationController } from './publication.controller';
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
    MongooseModule.forFeature([
      { name: Publication.name, schema: PublicationSchema },
    ]),
  ],
  controllers: [PublicationController],
  providers: [PublicationService],
  exports: [PublicationService],
})
export class PublicationModule {
  configure() {}
}
