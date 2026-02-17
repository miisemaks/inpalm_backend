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
import { UserService } from './user.service';
import { CreateUser, UpdateUser, UpdateMe } from './dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from 'src/user/user.schema';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/types/user-role';

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
      userId: string;
      role: UserRole;
    }>(token!);
    console.log('decoded', decoded);
    return this.usersService.updateMe(decoded.userId, updateUserDto);
  }
}
