import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User, UserDocument } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from 'src/auth/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'src/types/user-role';
import { AuthRegister } from 'src/auth/dto/auth-register';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UserService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) {}

  async login_test({
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

    const authModel = await this.authModel.findOne({
      userId: user._id,
    });

    if (!authModel) {
      throw new NotFoundException(
        'Пользователь не прошел регистрацию, обратитесь в службу поддержки',
      );
    }

    if (!bcrypt.compareSync(password, authModel.password)) {
      throw new NotFoundException('Пароли не совпадают');
    }

    const token = this.jwtService.sign({
      email: user.email,
      userId: user._id,
      role: user.role,
    });

    return {
      user: user,
      token: token,
    };
  }

  async register(data: AuthRegister): Promise<{ user: User; token: string }> {
    const auth = this.firebaseService.getAuth();

    const user = await this.usersService.findByEmail(data.email);
    if (user) {
      throw new NotFoundException(
        'Пользователь с таким email-ом уже зарегистрирован в нашем сервисе',
      );
    }

    await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.firstName + ' ' + data.lastName,
    });

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

    // const fbToken = await auth.createCustomToken(newAuth._id.toString(), {
    //   email: newUser.email,
    //   userId: newUser._id,
    //   role: newUser.role,
    // });

    const newToken = this.jwtService.sign({
      email: newUser.email,
      userId: newUser._id,
      role: newUser.role,
    });

    return {
      user: newUser.toJSON(),
      token: newToken,
    };
  }

  async login(token: string): Promise<{ user: User; token: string }> {
    const auth = this.firebaseService.getAuth();

    const response = await auth.verifyIdToken(token);
    const email = response.email;

    if (!email) {
      throw new NotFoundException('Пользователь не найден');
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Пользовтель не найден');
    }

    const new_token = this.jwtService.sign({
      email: user.email,
      userId: user._id,
      role: user.role,
    });

    return {
      user,
      token: new_token,
    };
  }

  async getAuths(): Promise<AuthDocument[]> {
    const auths = this.authModel.find();

    return auths;
  }

  async removeAuth(id: string): Promise<AuthDocument> {
    const auth = await this.authModel.findByIdAndDelete(id);

    if (!auth) {
      throw new NotFoundException();
    }

    return auth;
  }
}
