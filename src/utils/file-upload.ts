import { extname } from 'path';
import { randomBytes } from 'crypto';
import { BadRequestException } from '@nestjs/common';
export const imageFileFilter = (req, file, callback) => {
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|gif|pdf|doc|docx|JPG|JPEG|PNG|GIF|PDF|DOC|DOCX|)$/,
    )
  ) {
    return callback(new BadRequestException('Type not allowed'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  const randomName = randomBytes(8).toString('hex');
  callback(null, `${randomName}${fileExtName}`);
};

export const excelFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(xlsx|XLSX|xls|XLS)$/)) {
    return callback(new BadRequestException('Type not allowed'), false);
  }
  callback(null, true);
};
