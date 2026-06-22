import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicationCategoryEntity } from 'src/models/publication-category.entity';
import { PublicationSubcategoryEntity } from 'src/models/publication-subcategory.entity';
import {
  EPublicationStatus,
  PublicationEntity,
} from 'src/models/publication.entity';
import { UserEntity } from 'src/models/user.entity';
import { badWordsCheck } from 'src/utils/profanity.util';
import { Repository } from 'typeorm';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(PublicationEntity)
    private repo: Repository<PublicationEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(
    data: {
      title: string;
      content: string;
      category: string;
      subcategory: string;
    },
    authorId: string,
  ) {
    if (!data.category) {
      throw new BadRequestException('Не указан ID категории');
    }

    if (!data.subcategory) {
      throw new BadRequestException('Не указан ID подкатегории');
    }

    const user = await this.userRepo.findOne({ where: { id: authorId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (badWordsCheck(data.title) || badWordsCheck(data.content)) {
      throw new BadRequestException(
        'Вы заполнили данные с оскорбительными словами',
      );
    }

    const publication = new PublicationEntity();
    publication.author = user;
    publication.title = data.title;
    publication.content = data.content;
    publication.category = { id: data.category } as PublicationCategoryEntity;
    publication.subcategory = {
      id: data.subcategory,
    } as PublicationSubcategoryEntity;
    publication.status = EPublicationStatus.created;

    return await publication.save();
  }
}
