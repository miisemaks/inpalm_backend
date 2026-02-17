import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from './media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {}

  async createImageMedia(
    media: Express.Multer.File[],
    user_id: string,
  ): Promise<MediaDocument[]> {
    const data = Promise.all(
      media.map(async (i) => {
        const file = new this.mediaModel({
          url: `http://localhost:3000/` + i.path,
          type: 'image',
          createdAt: new Date().toISOString(),
          author: user_id,
        });

        return await file.save();
      }),
    );

    return await data;
  }

  async createVideoMedia(media: Express.Multer.File[]): Promise<MediaDocument> {
    const newMedia = new this.mediaModel(media);
    return await newMedia.save();
  }

  async delete(id: string): Promise<MediaDocument> {
    const deleteMedia = await this.mediaModel
      .findOneAndDelete({ _id: id })
      .exec();

    if (!deleteMedia) {
      throw new NotFoundException('Медиа не существует');
    }

    return deleteMedia;
  }

  async getUserMedia(user_id: string): Promise<MediaDocument[]> {
    const medias = await this.mediaModel.find({ author: user_id });

    return medias;
  }
}
