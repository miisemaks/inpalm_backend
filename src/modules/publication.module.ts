import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationController } from 'src/controllers/publication.controller';
import { AuthGuard } from 'src/guard/auth.guard';
import { PublicationCategoryEntity } from 'src/models/publication-category.entity';
import { PublicationSubcategoryEntity } from 'src/models/publication-subcategory.entity';
import { PublicationEntity } from 'src/models/publication.entity';
import { UserEntity } from 'src/models/user.entity';
import { PublicationsService } from 'src/services/publication.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PublicationEntity,
      PublicationCategoryEntity,
      PublicationSubcategoryEntity,
      UserEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
  controllers: [PublicationController],
  providers: [PublicationsService, AuthGuard],
  exports: [PublicationsService],
})
export class PublicationModule {}
