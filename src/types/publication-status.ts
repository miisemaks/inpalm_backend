export enum PublicationStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
  removed = 'removed',
}

export type PublicationStatusKey = keyof PublicationStatus;
