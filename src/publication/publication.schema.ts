import { Schema, HydratedDocument, model } from 'mongoose';
import { PublicationStatus } from '../types/publication-status.js';

export interface IPublication {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  status: PublicationStatus;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type PublicationDocument = HydratedDocument<IPublication>;

export const PublicationSchema = new Schema<IPublication>(
  {
    title: { type: 'String', required: true },
    content: { type: 'String', required: false },
    authorId: { type: 'String', required: true },
    status: {
      type: 'String',
      enum: PublicationStatus,
      required: false,
      default: PublicationStatus.draft,
    },
    views: {
      type: 'Number',
      default: 0,
      required: false,
    },
    likes: {
      type: 'Number',
      default: 0,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'publications',
  },
);

export const Publication = model<IPublication>(
  'Publication',
  PublicationSchema,
);
