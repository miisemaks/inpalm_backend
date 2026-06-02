import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { EUserRole, UserEntity } from 'src/models/user.entity';
import { Repository } from 'typeorm';

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
