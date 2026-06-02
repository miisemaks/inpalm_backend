import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    // другие поля пользователя
  };
}
