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

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

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
}
