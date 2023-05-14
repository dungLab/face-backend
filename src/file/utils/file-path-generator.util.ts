import { getCurrentDateFormat } from '@/common/utils/date.util';
import { FolderType } from '@/file/constants';
import * as crypto from 'crypto';

export function generateFileName(): string {
  return getCurrentDateFormat('yyyyMMdd')
    .concat('-')
    .concat(crypto.randomBytes(20).toString('hex'));
}

export function generateFolderPath(folderType: FolderType) {
  return process.env.NODE_ENV === 'production'
    ? `${folderType}/production`
    : `${folderType}/development`;
}
