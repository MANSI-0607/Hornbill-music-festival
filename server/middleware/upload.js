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

//
// --------------------------------------------
// DEFAULT UPLOAD (BAND AUDITION)
// --------------------------------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hornbill-bands',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
});

export const upload = multer({ storage });

//
// --------------------------------------------
// MERCH UPLOAD
// --------------------------------------------
const merchStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hornbill-merch',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `merch-${Date.now()}-${file.originalname}`
  }
});

export const uploadMerch = multer({ storage: merchStorage });

//
// --------------------------------------------
// HERO CAROUSEL IMAGE UPLOAD
// --------------------------------------------
const heroStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "hornbill-hero",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `hero-${Date.now()}-${file.originalname}`,
    transformation: [
      { quality: "auto:good" },
      { fetch_format: "auto" }
    ]
  }),
});




// multer instance for hero upload
export const uploadHero = multer({ storage: heroStorage });

//
// --------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------
export default upload;
