import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import {
  ESubscribeVariant,
  SubscribeEntity,
} from 'src/models/subscribe.entity';
import { UserEntity } from 'src/models/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SubscribesService {
  constructor(
    @InjectRepository(SubscribeEntity)
    private repo: Repository<SubscribeEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(
    data: {
      subscribeId: string;
      variant: ESubscribeVariant;
    },
    subscriberId: string,
  ) {
    if (!data.subscribeId || isUUID(data.subscribeId)) {
      throw new BadRequestException('Не указан ID модели');
    }

    if (!data.variant) {
      throw new BadRequestException('Не указан тип модели');
    }

    if (data.variant === ESubscribeVariant.user) {
      const subscribeUser = await this.userRepo.findOne({
        where: { id: data.subscribeId },
      });
      if (!subscribeUser) {
        throw new NotFoundException('Пользователь не найден');
      }
    }

    if (!subscriberId || !isUUID(subscriberId)) {
      throw new BadRequestException('Не указан ID пользователя');
    }

    const user = await this.userRepo.findOne({ where: { id: subscriberId } });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const existSubscribe = await this.repo.findOne({
      where: {
        subscribeId: data.subscribeId,
        variant: data.variant,
        subscriberId: subscriberId,
      },
    });

    if (existSubscribe) {
      throw new BadRequestException('Подписка уже была создана');
    }

    const like = new SubscribeEntity();
    like.variant = data.variant;
    like.subscribeId = data.subscribeId;
    like.subscriberId = subscriberId;

    return await like.save();
  }

  async getSubscribes(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Пользователь не указан');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const subscribes = await this.repo.find({
      where: { subscriberId: userId },
    });

    const subscribersId = subscribes.map((i) => i.subscriberId);

    const subscribers = await this.userRepo.find({
      where: { id: In(subscribersId) },
    });

    return subscribers;
  }
}
