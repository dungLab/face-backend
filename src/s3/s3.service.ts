import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private accessKey?: string;
  private secretAccessKey?: string;
  private region?: string;
  private bucket: any;
  private baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.accessKey = this.configService.get('aws.accessKey');
    this.secretAccessKey = this.configService.get('aws.secretAccessKey');
    this.region = this.configService.get('aws.region');
    this.bucket = this.configService.get('aws.s3.bucket');
    this.baseUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com`;

    this.s3 = new AWS.S3({
      accessKeyId: this.accessKey,
      secretAccessKey: this.secretAccessKey,
      region: this.region,
    });
  }

  //TODO: make S3 upload service
}
