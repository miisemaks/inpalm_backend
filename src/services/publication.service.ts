import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EPublicationStatus,
  PublicationEntity,
} from 'src/models/publication.entity';
import { UserEntity } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { Profanity } from '@2toad/profanity';

const profanity = new Profanity({
  languages: ['ru'],
  wholeWord: false,
  grawlix: '*****',
  grawlixChar: '$',
});

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(PublicationEntity)
    private repo: Repository<PublicationEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(data: { title: string; content: string }, authorId: string) {
    const user = await this.userRepo.findOne({ where: { id: authorId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (profanity.exists(data.title) || profanity.exists(data.content)) {
      throw new BadRequestException(
        'Вы заполнили данные с оскорбительными словами',
      );
    }

    const publication = new PublicationEntity();
    publication.author = user;
    publication.title = data.title;
    publication.content = data.content;
    publication.status = EPublicationStatus.created;

    return await publication.save();
  }
}
