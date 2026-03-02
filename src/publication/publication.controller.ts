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
import type { Request } from 'express';
import { PublicationService } from './publication.service.js';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
  PublicationDto,
} from './dto/index.js';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserRole } from 'src/types/user-role.js';
import { JwtService } from '@nestjs/jwt';

@Controller('publications')
export class PublicationController {
  constructor(
    private readonly publicationService: PublicationService,
    private jwtService: JwtService,
  ) {}

  @ApiCreatedResponse({
    description: 'Пользователь успешно добавлен',
    type: PublicationDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreatePublicationDto) {
    return this.publicationService.create(data);
  }

  @ApiOkResponse({
    type: [PublicationDto],
  })
  @Get()
  async getPublications() {
    return this.publicationService.getActivePublications();
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: PublicationDto,
  })
  @Get(':id')
  async getPublication(@Param('id') id: string) {
    return this.publicationService.findOne(id);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: PublicationDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.publicationService.remove(id);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: PublicationDto,
  })
  @Put(':id')
  async update(@Body() data: UpdatePublicationDto, @Param('id') id: string) {
    return this.publicationService.update(id, data);
  }

  @ApiOkResponse({
    type: PublicationDto,
  })
  @Get('active')
  async getActiveUserPublications(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = this.jwtService.decode<{
      email: string;
      sub: string;
      role: UserRole;
    }>(token!) as { email: string; sub: string; role: UserRole };

    return this.publicationService.getUserActivePublications(decoded.sub);
  }

  @ApiOkResponse({
    type: PublicationDto,
  })
  @Get('inactive')
  async getInactiveUserPublications(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = this.jwtService.decode<{
      email: string;
      sub: string;
      role: UserRole;
    }>(token!) as { email: string; sub: string; role: UserRole };

    return this.publicationService.getUserInactivePublications(decoded.sub);
  }
}
