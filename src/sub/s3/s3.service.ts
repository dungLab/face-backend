import { ErrorResponse } from '@/common/error-response.exception';
import { getCurrentDateFormat } from '@/common/utils/date.util';
import { FolderType, S3BucketType } from '@/sub/s3/constants';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class S3Service {
  private accessKey: string;
  private secretAccessKey: string;
  private region: string;
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.accessKey = this.configService.get('aws.accessKey');
    this.secretAccessKey = this.configService.get('aws.secretAccessKey');
    this.region = this.configService.get('aws.region');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async uploadAndGetUrl(
    file: Express.Multer.File,
    bucket: S3BucketType,
    folderType: FolderType,
  ) {
    const fileName = `${this._generateFolderPath(
      folderType,
    )}/${this._generateFileName(file.originalname)}`;

    const param: PutObjectCommandInput = {
      Bucket: bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(param);

    try {
      await this.s3Client.send(command);

      return this._getUrlFromBucket(bucket, fileName);
    } catch (err) {
      throw new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'upload file to s3 fail',
        code: -1,
      });
    }
  }

  private _generateFileName(fileName: string): string {
    const fileExt = `.${fileName.split('.').pop()}`;
    return getCurrentDateFormat('yyyyMMdd')
      .concat('-')
      .concat(crypto.randomBytes(20).toString('hex'))
      .concat(fileExt);
  }

  private _generateFolderPath(folderType: FolderType) {
    return process.env.NODE_ENV === 'production'
      ? `${folderType}/production`
      : `${folderType}/development`;
  }

  private _getUrlFromBucket(s3Bucket: S3BucketType, fileName: string) {
    const regionString = this.region.includes('us-east-1')
      ? ''
      : '-' + this.region;
    return `https://${s3Bucket}.s3${regionString}.amazonaws.com/${fileName}`;
  }
}
