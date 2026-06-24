import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { ELikeVariant, LikeEntity } from 'src/models/like.entity';
import { UserEntity } from 'src/models/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeEntity)
    private repo: Repository<LikeEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(
    data: {
      id: string;
      variant: ELikeVariant;
    },
    authorId: string,
  ) {
    if (!data.id || isUUID(data.id)) {
      throw new BadRequestException('Не указан ID модели');
    }

    if (!data.variant) {
      throw new BadRequestException('Не указан тип модели');
    }

    if (data.variant === ELikeVariant.publication) {
      const publication = await this.repo.findOne({ where: { id: data.id } });
      if (!publication) {
        throw new NotFoundException('Публикация не найдена');
      }
    }

    if (!authorId || !isUUID(authorId)) {
      throw new BadRequestException('Не указан ID пользователя');
    }

    const user = await this.userRepo.findOne({ where: { id: authorId } });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const existLike = await this.repo.findOne({
      where: {
        userId: authorId,
        modelId: data.id,
      },
    });

    if (existLike) {
      throw new BadRequestException('Лайк уже был создан');
    }

    const like = new LikeEntity();
    like.variant = data.variant;
    like.modelId = data.id;
    like.userId = authorId;

    return await like.save();
  }

  async delete(id: string, authorId: string) {
    if (typeof id !== 'string' || isUUID(id)) {
      throw new BadRequestException('ID модели неправильно указан');
    }

    if (typeof authorId !== 'string' || isUUID(authorId)) {
      throw new BadRequestException('ID пользователя неправильно указан');
    }

    const like = await this.repo.findOne({
      where: { modelId: id, userId: authorId },
    });

    if (!like) {
      throw new NotFoundException('Лайк не найден');
    }

    await this.repo.delete({
      id: like.id,
    });

    return like;
  }

  async findPublicationLikes(publicationId: string) {
    if (typeof publicationId !== 'string' || !isUUID(publicationId)) {
      throw new BadRequestException('ID публикации указан неверно');
    }

    const likes = await this.repo.find({
      where: {
        variant: ELikeVariant.publication,
        modelId: publicationId,
      },
    });

    const userIds = likes.map((like) => like.userId);

    const users = await this.userRepo.find({ where: { id: In(userIds) } });

    return users;
  }

  async findUserLikes(userId: string) {
    if (typeof userId !== 'string' || !isUUID(userId)) {
      throw new BadRequestException('ID пользователя указан неверно');
    }

    const likes = await this.repo.find({ where: { userId } });

    return likes;
  }
}
