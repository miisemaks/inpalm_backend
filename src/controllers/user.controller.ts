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
  Headers,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUser } from '../types/create-user';
import { UpdateUser } from '../types/update-user';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/types/user-role';
import { UpdateMe } from 'src/types/update-me';

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

  @ApiOkResponse({
    description: 'Успешный ответ',
    schema: {
      allOf: [
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(User) },
            },
          },
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
      sub: string;
      role: UserRole;
    }>(token!);
    return this.usersService.updateMe(decoded.sub, updateUserDto);
  }
}
