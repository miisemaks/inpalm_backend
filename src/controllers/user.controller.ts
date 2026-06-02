import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserBodyUpdateDto } from 'src/dto/user/user.body.dto';
import { UserDto } from 'src/dto/user/user.dto';
import { UserResponseDto } from 'src/dto/user/user.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UsersService } from 'src/services/user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly service: UsersService) {}

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getMe(@Request() req): Promise<UserResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.service.getUserById(req.user.id);

    return { data: new UserDto(user) };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.service.getUserById(id);

    return { data: new UserDto(user) };
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async updateUser(
    @Request() req,
    @Body() data: UserBodyUpdateDto,
  ): Promise<UserResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.service.getUserById(req.user.id);

    const updatedUser = await this.service.update(user.id, data);

    return { data: new UserDto(updatedUser) };
  }

  @Delete('profile')
  @UseGuards(AuthGuard)
  async deleteUser(@Request() req): Promise<UserResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.service.deleteUser(req.user.id);

    return { data: new UserDto(user.data) };
  }
}
