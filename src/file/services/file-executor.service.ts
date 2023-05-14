import { FolderType } from '@/file/constants';

export interface FileExecutorService {
  upload(
    file: Express.Multer.File,
    folderType: FolderType,
  ): Promise<{ url: string; publicId: string }>;
}
