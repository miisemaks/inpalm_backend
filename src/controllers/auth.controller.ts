import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { AuthLogin } from 'src/types/auth-login';
import { AuthRegister } from 'src/types/auth-register';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() data: AuthLogin) {
    return this.authService.login(data);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body()
    data: AuthRegister,
  ) {
    return this.authService.register(data);
  }
}
