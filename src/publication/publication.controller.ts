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
import { PublicationService } from './publication.service';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Publication } from './publication.schema';
import { UserRole } from 'src/types/user-role';
import { JwtService } from '@nestjs/jwt';

@Controller('publications')
export class PublicationController {
  constructor(
    private readonly publicationService: PublicationService,
    private jwtService: JwtService,
  ) {}

  @ApiCreatedResponse({
    description: 'Пользователь успешно добавлен',
    type: Publication,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreatePublicationDto) {
    return this.publicationService.create(data);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(Publication) },
        },
      ],
    },
  })
  @Get()
  async getPublications() {
    return this.publicationService.getActivePublications();
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: Publication,
  })
  @Get(':id')
  async getPublication(@Param('id') id: string) {
    return this.publicationService.findOne(id);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: Publication,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.publicationService.remove(id);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: Publication,
  })
  @Put(':id')
  async update(@Body() data: UpdatePublicationDto, @Param('id') id: string) {
    return this.publicationService.update(id, data);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(Publication) },
        },
      ],
    },
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
    schema: {
      allOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(Publication) },
        },
      ],
    },
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
