
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

// Configure AWS S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const BASE_URL = (process.env.NODE_ENV === 'production' ? process.env.BASE_URL_PROD : process.env.BASE_URL_DV)
    || `http://localhost:${process.env.PORT || 4000}`;

// Configure multer for memory storage
const storage = multer.memoryStorage();

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        fieldSize: 8 * 1024 * 1024, // 8MB per text field (busboy's 1MB default is too small for long rich-text fields)
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed'));
        }
    }
});

// Resize/re-encode large images to keep S3 storage + page-load size down.
// Animated GIFs are passed through untouched (sharp would flatten them to a
// single frame), everything else is capped to 1600px wide and re-compressed.
const compressImage = async (file) => {
    const isGif = file.mimetype === 'image/gif' || path.extname(file.originalname).toLowerCase() === '.gif';
    if (isGif) return file.buffer;

    try {
        const image = sharp(file.buffer);
        const metadata = await image.metadata();

        let pipeline = image.resize({ width: 1600, withoutEnlargement: true });

        if (metadata.format === 'png') {
            pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
        } else if (metadata.format === 'webp') {
            pipeline = pipeline.webp({ quality: 80 });
        } else {
            pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
        }

        return await pipeline.toBuffer();
    } catch (error) {
        // If compression fails for any reason, fall back to the original buffer
        // rather than blocking the upload over an optimization step.
        console.warn('Image compression failed, uploading original:', error.message);
        return file.buffer;
    }
};

// Saves the buffer locally under uploads/<folder>/ and returns a URL served
// by the app's own express.static('/uploads') mount.
const saveLocally = (buffer, folder, fileExtension) => {
    const dir = path.join(UPLOADS_DIR, folder);
    fs.mkdirSync(dir, { recursive: true });

    const filename = `${uuidv4()}${fileExtension}`;
    fs.writeFileSync(path.join(dir, filename), buffer);

    return `${BASE_URL}/uploads/${folder}/${filename}`;
};

// Helper function to upload file to S3, falling back to local disk storage
// (instead of throwing / crashing the request) if S3 is unreachable or its
// limits/quota have been hit.
exports.uploadToS3 = async (file, folder = 'surplus-packages') => {
    const fileExtension = path.extname(file.originalname);
    const compressedBuffer = await compressImage(file);

    try {
        const key = `${folder}/${uuidv4()}${fileExtension}`;

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: compressedBuffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
        console.warn(`S3 upload failed, saving locally instead: ${error.message}`);
        try {
            return saveLocally(compressedBuffer, folder, fileExtension);
        } catch (localError) {
            throw new Error(`S3 upload failed and local fallback also failed: ${localError.message}`);
        }
    }
};

// Helper function to delete file from S3 (or the local fallback file, if
// that's where it actually ended up).
exports.deleteFromS3 = async (url) => {
    if (!url) return;

    if (url.includes(`${BASE_URL}/uploads/`)) {
        const relativePath = url.split(`${BASE_URL}/uploads/`)[1];
        if (!relativePath) return;
        const filePath = path.join(UPLOADS_DIR, relativePath);
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') console.error('Error deleting local file:', err.message);
        });
        return;
    }

    try {
        // Extract key from URL
        const key = url.split('.amazonaws.com/')[1];
        if (!key) return;

        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
        // console.log('File deleted from S3:', key);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
    }
};
