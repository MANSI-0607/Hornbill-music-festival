import dotenv from 'dotenv';
dotenv.config(); 

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hornbill-bands',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});

const merchStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hornbill-merch',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `merch-${Date.now()}-${file.originalname}`
  }
});

const upload = multer({ storage });
export const uploadMerch = multer({ storage: merchStorage });
export default upload;
