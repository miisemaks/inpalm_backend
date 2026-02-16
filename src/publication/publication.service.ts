import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publication, PublicationDocument } from './publication.schema';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';

@Injectable()
export class PublicationService {
  constructor(
    @InjectModel(Publication.name)
    private publicationModel: Model<PublicationDocument>,
  ) {}

  async create(data: CreatePublicationDto): Promise<PublicationDocument> {
    const publication = new this.publicationModel({
      ...data,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    });

    return await publication.save();
  }

  async findOne(id: string): Promise<PublicationDocument> {
    const publication = await this.publicationModel.findById(id).exec();

    if (!publication) {
      throw new NotFoundException('Публикация не найдена');
    }

    return publication;
  }

  async update(
    id: string,
    data: UpdatePublicationDto,
  ): Promise<PublicationDocument> {
    const publication = await this.publicationModel
      .findByIdAndUpdate(id, { ...data, updatedAt: new Date().toString() })
      .exec();

    if (!publication) {
      throw new NotFoundException('Публикация не найдена');
    }

    return publication;
  }

  async remove(id: string): Promise<Publication> {
    const publication = await this.publicationModel
      .findByIdAndDelete(id)
      .exec();

    if (!publication) {
      throw new NotFoundException('Публикация не найдена');
    }

    return publication;
  }

  async getUserPublications(id: string): Promise<PublicationDocument[]> {
    const publications = await this.publicationModel.find({ authorId: id });

    return publications;
  }

  async getUserActivePublications(id: string): Promise<PublicationDocument[]> {
    const publications = await this.publicationModel.find({
      authorId: id,
      status: ['published'],
    });

    return publications;
  }

  async getUserInactivePublications(
    id: string,
  ): Promise<PublicationDocument[]> {
    const publications = await this.publicationModel.find({
      authorId: id,
      status: ['removed', 'archived'],
    });

    return publications;
  }

  async getActivePublications(): Promise<PublicationDocument[]> {
    const publications = await this.publicationModel.find({
      status: ['published'],
    });
    return publications;
  }
}
