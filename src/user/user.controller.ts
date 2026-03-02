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
  UserDto,
} from './dto/index.js';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { User } from './user.schema.js';
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
    type: UserDto,
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
    type: [UserDto],
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

  @ApiOperation({
    summary: 'Получение данных пользователя',
    description: 'Возвращает данные пользователя',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Обновление данных пользователя',
    description: 'Обновляет и возвращает обновленные данные пользователя',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUser) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOkResponse({
    type: UserDto,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: UserDto,
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
    type: UserDto,
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
    type: UserDto,
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
