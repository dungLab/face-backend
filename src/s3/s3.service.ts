import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private accessKey?: string;
  private secretAccessKey?: string;
  private region?: string;
  private bucket: any;
  private baseUrl: string;

  //TODO: make S3 upload service
}
