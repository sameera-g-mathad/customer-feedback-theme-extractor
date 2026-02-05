import { type ChangeEvent } from 'react';

export interface fileUploadInterface {
  accept: string;
  multiple: boolean;
  onFileupload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface progressBarInterface {
  progress: number;
  onComplete?: () => void;
}
