import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
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
    @InjectRepository(PublicationCategoryEntity)
    private categoryRepo: Repository<PublicationCategoryEntity>,
    @InjectRepository(PublicationSubcategoryEntity)
    private subcategory: Repository<PublicationSubcategoryEntity>,
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

    const category = await this.categoryRepo.findOne({
      where: { id: data.category },
    });

    if (!category) {
      throw new BadRequestException('Категория не найдена');
    }

    if (!data.subcategory) {
      throw new BadRequestException('Не указан ID подкатегории');
    }

    const subcategory = await this.subcategory.findOne({
      where: { id: data.subcategory },
    });

    if (subcategory) {
      throw new BadRequestException('Подкатегория не найдена');
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

  async edit(
    id: string,
    data: {
      title: string | null;
      content: string | null;
      category: string | null;
      subcategory: string | null;
    },
    userId: string,
  ) {
    if (!id) {
      throw new BadRequestException('Идентификатор публикации не указан');
    }
    const publication = await this.repo.findOne({ where: { id: id } });
    if (!publication) {
      throw new BadRequestException('Публикация не найдена');
    }
    if (publication.authorId !== userId) {
      throw new ForbiddenException('Вы не являетесь создателем публикации');
    }

    if (data.title && badWordsCheck(data.title)) {
      throw new BadRequestException(
        'Вы заполнили данные заголовка с оскорбительными словами',
      );
    }
    if (data.title) publication.title = data.title;

    if (data.content && badWordsCheck(data.content)) {
      throw new BadRequestException(
        'Вы заполнили данные контента с оскорбительными словами',
      );
    }
    if (data.content) publication.content = data.content;

    if (data.category !== null) {
      const category = await this.categoryRepo.findOne({
        where: { id: data.category },
      });

      if (!category) {
        throw new BadRequestException('Категория не найдена');
      }

      publication.category = { id: data.category } as PublicationCategoryEntity;
    }

    if (data.subcategory !== null) {
      const subcategory = await this.subcategory.findOne({
        where: { id: data.subcategory },
      });
      if (!subcategory) {
        throw new BadRequestException('Подкатегория не найдена');
      }
      publication.subcategory = {
        id: data.subcategory,
      } as PublicationSubcategoryEntity;
    }

    await publication.save();
    return publication;
  }

  async delete(id: string, userId: string) {
    if (typeof id !== 'string' || !isUUID(id)) {
      throw new BadRequestException('ID публикации неверно указан');
    }

    const publication = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: {
        category: true,
        subcategory: true,
      },
    });

    if (!publication) {
      throw new NotFoundException('Публикация не найдена');
    }

    if (publication.authorId !== userId) {
      throw new ForbiddenException('Вы не можете удалить публикацию');
    }

    await this.repo.delete(id);

    return publication;
  }
}
