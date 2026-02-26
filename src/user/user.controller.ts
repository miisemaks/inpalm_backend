import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import {
  CreateUser,
  UpdateUser,
  UpdateMe,
  UpdateMeAvatar,
} from './dto/index.js';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from '../user/user.entity.js';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../types/user-role.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  @ApiCreatedResponse({
    description: 'Пользователь успешно добавлен',
    type: User,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUser: CreateUser) {
    return this.usersService.create(createUser);
  }

  @ApiOperation({
    summary: 'Получение списка пользователей',
    description: 'Возвращает список пользователей',
  })
  @ApiOkResponse({
    description: 'Успешный ответ',
    schema: {
      allOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(User) },
        },
      ],
    },
  })
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('count')
  async count() {
    const count = await this.usersService.count();
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUser) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: User,
  })
  @Put('me')
  async updateMe(@Body() updateUserDto: UpdateMe, @Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = this.jwtService.decode<{
      email: string;
      userId: string;
      role: UserRole;
    }>(token!);

    return this.usersService.updateMe(decoded.userId, updateUserDto);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: User,
  })
  @Put('me/avatar')
  async updateMeAvatar(@Body() data: UpdateMeAvatar, @Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = this.jwtService.decode<{
      email: string;
      userId: string;
      role: UserRole;
    }>(token!);

    return this.usersService.updateAvatar(decoded.userId, data.id);
  }

  @ApiOkResponse({
    description: 'Успшеный ответ',
    type: User,
  })
  @Delete('me/avatar')
  async deleteUserAvatar(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = this.jwtService.decode<{
      email: string;
      userId: string;
      role: UserRole;
    }>(token!);

    return this.usersService.deleteAvatar(decoded.userId);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: User,
  })
  @Get('me')
  async getMe(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = this.jwtService.decode<{
      email: string;
      userId: string;
      role: UserRole;
    }>(token!);

    return this.usersService.findOne(decoded.userId);
  }
}
