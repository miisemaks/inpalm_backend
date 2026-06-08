import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EUserRole, UserEntity } from 'src/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async seed() {
    const count = await this.userRepo.count();

    if (count === 0) {
      const user = this.userRepo.create({
        email: process.env.SEEDER_USER_EMAIL!,
        phone: process.env.SEEDER_USER_PHONE!,
        firstName: process.env.SEEDER_USER_FIRSTNAME!,
        lastName: process.env.SEEDER_USER_LASTNAME!,
        role: EUserRole.admin,
      });

      await this.userRepo.save(user);
      console.log('Пользователь успешно добавлен');
    } else {
      console.log('Таблица не пустая');
    }
  }
}
