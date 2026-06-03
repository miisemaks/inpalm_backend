import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/models/refresh-token.entity';
import { MoreThan, Repository } from 'typeorm';
import { UsersService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import dayjs from 'dayjs';
import { UserEntity } from 'src/models/user.entity';
import { UserDto } from 'src/dto/user/user.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getCode(email: string) {
    if (!isEmail(email)) {
      throw new BadRequestException('Электронная почта указано неправильно');
    }
    const user = await this.userService.getUserByEmail(email);

    const randomCode = 1234;

    user.loginCode = randomCode.toString();
    const expires = dayjs().add(2, 'minute').toISOString();
    user.codeExpires = expires;
    await user.save();

    return { expires };
  }

  async verifyCode(email: string, code: string) {
    if (!isEmail(email)) {
      throw new BadRequestException('Электронная почта указано неправильно');
    }
    const user = await this.userService.getUserByEmail(email);

    if (dayjs().isAfter(user.codeExpires, 'second')) {
      throw new BadRequestException('Срок действия кода истек');
    }

    if (user.loginCode === null) {
      throw new BadRequestException('Вы не отправили код подтверждения');
    }

    if (code !== user.loginCode) {
      throw new BadRequestException('Код недействителен');
    }

    user.codeExpires = null;
    user.loginCode = null;
    await user.save();

    return await this.getTokens(user);
  }

  async getTokens(user: UserEntity) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshToken = new RefreshTokenEntity();
    refreshToken.token = this.generateSecureToken();

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    refreshToken.expires = expires;
    refreshToken.user = user;

    const refreshTokenCreated = await refreshToken.save();
    const accessToken = await this.jwtService.signAsync(payload);

    const userDto = new UserDto(user);
    return {
      accessToken,
      token: refreshTokenCreated.token,
      user: userDto,
    };
  }

  private generateSecureToken(): string {
    return randomBytes(48).toString('base64url');
  }

  async refreshToken(token: string) {
    const now = new Date();
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: {
        token,
        expires: MoreThan(now),
      },
      relations: {
        user: true,
      },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Неправильный refresh token');
    }

    await this.refreshTokenRepo.delete({ token: refreshToken.token });

    return this.getTokens(refreshToken.user);
  }

  async register(data: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  }) {
    const checkEmail = await this.userService.checkEmailExist(data.email);
    if (checkEmail) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    if (data.phone) {
      const checkPhone = await this.userService.checkPhoneExist(data.phone);
      if (checkPhone) {
        throw new BadRequestException(
          'Пользователь с таким номером телефона уже существует',
        );
      }
    }

    const user = await this.userService.create(data);
    const randomCode = 1234;

    user.loginCode = randomCode.toString();
    const expires = dayjs().add(2, 'minute').toISOString();
    user.codeExpires = expires;
    await user.save();

    return {
      expires: expires,
    };
  }

  async sendCodeToNewEmail(id: string, newEmail: string) {
    const isEmailExist = await this.userService.checkEmailExist(newEmail);
    const user = await this.userService.getUserById(id);

    if (isEmailExist) {
      throw new BadRequestException(
        'Новая электронная почта уже используется другим пользователем',
      );
    }

    const randomCode = 1234;

    user.loginCode = randomCode.toString();
    const expires = dayjs().add(2, 'minute').toISOString();
    user.codeExpires = expires;
    await user.save();

    return { expires };
  }

  async verifyCodeToNewEmail(id: string, newEmail: string, code: string) {
    if (isEmail(newEmail)) {
      throw new BadRequestException('Неверный формат электронной почты');
    }

    const isEmailExist = await this.userService.checkEmailExist(newEmail);
    const user = await this.userService.getUserById(id);

    if (isEmailExist) {
      throw new BadRequestException(
        'Новая электронная почта уже используется другим пользователем',
      );
    }

    if (dayjs().isAfter(user.codeExpires, 'second')) {
      throw new BadRequestException('Срок действия кода истек');
    }

    if (user.loginCode === null) {
      throw new BadRequestException('Вы не отправили код подтверждения');
    }

    if (code !== user.loginCode) {
      throw new BadRequestException('Код недействителен');
    }

    user.email = newEmail;
    user.loginCode = null;
    user.codeExpires = null;
    await user.save();

    return await this.getTokens(user);
  }
}
