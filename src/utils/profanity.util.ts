import { profanityCheck } from 'profanity-guard';

export const badWordsCheck = (str: string) => {
  return profanityCheck(str, 'ru');
};
