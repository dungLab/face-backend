import { FolderType } from '@/file/constants';
import { FileExecutorService } from '@/file/services/file-executor.service';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { generateFolderPath } from '@/file/utils/file-path-generator.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryExecutorService implements FileExecutorService {
  private cloudinaryBaseUrl =
    'https://res.cloudinary.com/{CLOUDINARY_NAME}/image/upload';
  private cloudName: string;

  constructor(private readonly configService: ConfigService) {
    this.cloudName = configService.get('cloudinary.name');
    this.cloudinaryBaseUrl = this.cloudinaryBaseUrl.replace(
      '{CLOUDINARY_NAME}',
      this.cloudName,
    );

    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: configService.get('cloudinary.apiKey'),
      api_secret: configService.get('cloudinary.apiSecret'),
    });
  }
  async upload(
    file: Express.Multer.File,
    folder: FolderType,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: generateFolderPath(folder) },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: `${this.cloudinaryBaseUrl}/${result.public_id}`,
            publicId: result.public_id,
          });
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
