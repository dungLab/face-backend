import { ErrorResponse } from '@/common/error-response.exception';
import { HttpStatus } from '@nestjs/common';

export type FileValidationErrorReqType = Request & {
  fileValidationError?: 'only image file allowed';
};

export const imageFileFilter = (
  req: FileValidationErrorReqType,
  file: Express.Multer.File,
  callback: any,
) => {
  if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
    callback(
      new ErrorResponse(HttpStatus.BAD_REQUEST, {
        message: `허용되지 않은 minetype입니다. ${file.mimetype}`,
        code: -1,
      }),
    );
  }
  callback(null, true);
};
