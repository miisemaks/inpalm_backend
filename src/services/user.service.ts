import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { EUserRole, UserEntity } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { badWordsCheck } from 'src/utils/profanity.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  async getUserById(id: string) {
    if (!isUUID(id, '4')) {
      throw new BadRequestException(
        'Идентификатор пользователя не указан неправильно',
      );
    }

    const user = await this.repo.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async getUserByPhone(phone: string) {
    if (typeof phone !== 'string') {
      throw new BadRequestException('Номер телефона неверно указан');
    }

    const user = await this.repo.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    if (typeof email !== 'string') {
      throw new BadRequestException('Эл. почта неверно указана');
    }

    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async checkEmailExist(email: string) {
    const user = await this.repo.findOne({ where: { email } });

    return !!user;
  }

  async checkPhoneExist(phone: string) {
    const user = await this.repo.findOne({ where: { phone } });

    return !!user;
  }

  async create(data: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  }) {
    const userExist = await this.repo.findOne({ where: { email: data.email } });
    if (userExist) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
    if (data.firstName && badWordsCheck(data.firstName)) {
      throw new BadRequestException(
        'Вы использовали оскорбительные слова к имени',
      );
    }

    if (data.lastName && badWordsCheck(data.lastName)) {
      throw new BadRequestException(
        'Вы использовали оскорбительные слова к фамилии',
      );
    }

    const newUser = new UserEntity();
    newUser.email = data.email;
    newUser.firstName = data.firstName;
    newUser.lastName = data.lastName;
    newUser.phone = data.phone;
    newUser.role = EUserRole.customer;

    return await newUser.save();
  }

  async update(
    id: string,
    data: {
      firstName: string | null;
      lastName: string | null;
      phone: string | null;
    },
  ) {
    if (typeof id !== 'string') {
      throw new BadRequestException('Идентификатор указан неправильно');
    }

    if (data.firstName && badWordsCheck(data.firstName)) {
      throw new BadRequestException(
        'Вы использовали оскорбительные слова к имени',
      );
    }

    if (data.lastName && badWordsCheck(data.lastName)) {
      throw new BadRequestException(
        'Вы использовали оскорбительные слова к фамилии',
      );
    }

    await this.repo.update({ id }, { ...data });

    return await this.getUserById(id);
  }

  async deleteUser(id: string) {
    if (!isUUID(id, '4')) {
      throw new BadRequestException(
        'Идентификатор пользователя не указан неправильно',
      );
    }

    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const result = await this.repo.delete(id);

    return { data: user, result };
  }
}
