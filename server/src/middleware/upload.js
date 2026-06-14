const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const config = require('../config/env');
const fs = require('fs');
const path = require('path');

// Ensure local directory exists in the client's public images directory
const localUploadDir = path.join(__dirname, '../../../client/public/images/pizzas');
if (!fs.existsSync(localUploadDir)) {
  fs.mkdirSync(localUploadDir, { recursive: true });
}

// 1. Local Storage engine
const localDiskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, localUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// 2. Cloudinary Storage engine
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'slicesprint/pizzas',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'limit' }],
  },
});

// Check if Cloudinary credentials are fully configured
const isCloudinaryConfigured = 
  config.cloudinary.cloudName && 
  config.cloudinary.apiKey && 
  config.cloudinary.apiSecret &&
  config.cloudinary.cloudName !== 'your_cloudinary_cloud_name';

// Determine standard storage engine
const activeStorage = isCloudinaryConfigured ? cloudinaryStorage : localDiskStorage;

// Set file filter for local storage uploads to match Cloudinary constraints
const imageFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (.jpg, .jpeg, .png, .webp) are allowed!'), false);
  }
};

const upload = multer({ 
  storage: activeStorage,
  fileFilter: imageFilter
});

module.exports = upload;

