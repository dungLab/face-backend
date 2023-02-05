import { ErrorResponse } from '@/common/error-response.exception';
import { getCurrentDateFormat } from '@/common/utils/date.util';
import { FaceFolderType, S3BucketType } from '@/s3/constants';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { AWSRegion } from 'aws-sdk/clients/cur';
import * as crypto from 'crypto';

@Injectable()
export class S3Service {
  private accessKey?: string;
  private secretAccessKey?: string;

  constructor(private readonly configService: ConfigService) {
    this.accessKey = this.configService.get('aws.accessKey');
    this.secretAccessKey = this.configService.get('aws.secretAccessKey');
  }

  async upload(
    file: Express.Multer.File,
    region: AWSRegion,
    bucket: S3BucketType,
    folder: FaceFolderType,
  ) {
    const s3 = new AWS.S3({
      accessKeyId: this.accessKey,
      secretAccessKey: this.secretAccessKey,
      region,
    });
    const param = {
      Bucket: bucket,
      Key: `${folder}/${this._generateFileName(file.originalname)}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };

    try {
      const uploadedFile = await s3.upload(param).promise();

      return uploadedFile.Location;
    } catch (err) {
      Logger.error(err);
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
}
