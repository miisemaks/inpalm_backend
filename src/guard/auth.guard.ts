import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EUserRole } from 'src/models/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    try {
      const payload: { phone: string; id: number; role: EUserRole } =
        await this.jwtService.verifyAsync(token, {
          ignoreExpiration: true,
        });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }
    const [type, token]: string[] = authHeader.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
