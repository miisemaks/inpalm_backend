import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserSeeder } from 'db/seeds/user.seeder';
import { RefreshTokenEntity } from 'src/models/refresh-token.entity';
import { UserEntity } from 'src/models/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      entities: [UserEntity, RefreshTokenEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],

  providers: [UserSeeder],
})
export class SeederModule {}
