import path from 'path';
import multer from 'multer';
import { Request } from 'express';

interface MulterFile extends Express.Multer.File {}

const storage = multer.diskStorage({
  destination: function (req: Request, file: MulterFile, cb: any) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    const timestamp: number = Date.now();
    const randomNumber: number = Math.floor(Math.random() * 10000);
    const uniqueNumber: number = timestamp + randomNumber;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueNumber}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req: Request, file: MulterFile, cb: any) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File harus berupa gambar!'), false);
    }
  },
});

export default upload;
