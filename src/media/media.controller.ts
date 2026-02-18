import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { MediaService } from './media.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Media } from './media.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiCreatedResponse({
    description: 'Добавление фото',
    type: Media,
  })
  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        author: {
          type: 'string',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const author = req.body.author as string;
          const uploadPath = `./photos/${author}`;

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async createImageMedia(
    @UploadedFiles()
    files: Express.Multer.File[],
    @Body() body: { author: string },
  ) {
    const author = body.author;
    return this.mediaService.createImageMedia(files, author);
  }

  @ApiCreatedResponse({
    description: 'Добавление видео',
    type: Media,
  })
  @Post('video')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        author: {
          type: 'string',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const author = req.body.author as string;
          const uploadPath = `./videos/${author}`;

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(mp4)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 20,
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async createVideoMedia(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { author: string },
  ) {
    const author = body.author;
    return this.mediaService.createVideoMedia(files, author);
  }

  @ApiOkResponse({
    description: 'Успешный ответ',
    type: Media,
  })
  @Delete('image/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(Media) },
        },
      ],
    },
  })
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  async getUserMedia(@Param('id') id: string) {
    return this.mediaService.getUserMedia(id);
  }
}
