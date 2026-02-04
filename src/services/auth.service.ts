import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from 'src/schemas/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'src/types/user-role';
import { AuthRegister } from 'src/types/auth-register';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    user: User;
    token: string;
  }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        `Пользователь не зарегистрирован в нашем сервисе`,
      );
    }

    const auth = await this.authModel.findOne({
      userId: user._id,
    });

    if (!auth) {
      throw new NotFoundException(
        'Пользователь не прошел регистрацию, обратитесь в службу поддержки',
      );
    }

    if (!bcrypt.compareSync(password, auth.password)) {
      throw new NotFoundException('Пароли не совпадают');
    }

    const token = this.jwtService.sign({
      email: user.email,
      sub: user._id,
      role: user.role,
    });

    return {
      user: user,
      token: token,
    };
  }

  async register(data: AuthRegister): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findByEmail(data.email);
    if (user) {
      throw new NotFoundException(
        'Пользователь с таким email-ом уже зарегистрирован в нашем сервисе',
      );
    }

    const newUser = new this.userModel({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      birthdate: data.birthdate,
      role: UserRole.customer,
    });

    await newUser.save();

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    const newAuth = new this.authModel({
      userId: newUser._id,
      password: hash,
    });

    await newAuth.save();

    const token = this.jwtService.sign({
      email: newUser.email,
      sub: newUser._id,
      role: newUser.role,
    });

    return {
      user: newUser.toJSON(),
      token: token,
    };
  }
}
