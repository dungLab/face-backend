import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  async uploadImage(image: Express.Multer.File) {
    //TODO upload image to S3
  }
}
