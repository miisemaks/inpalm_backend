import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserRole } from 'src/types/user-role';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const isValid = await this.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException('Неверный токен');
    }

    next();
  }

  private async validateToken(token: string): Promise<boolean> {
    const decoded = this.jwtService.decode<{
      email: string;
      sub: string;
      role: UserRole;
    }>(token);

    const user = await this.userModel.findById(decoded.sub);

    if (!user) {
      return false;
    }

    return true;
  }
}
