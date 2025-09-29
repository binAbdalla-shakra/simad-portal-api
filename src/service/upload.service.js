
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Configure AWS S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


// Configure multer for memory storage
const storage = multer.memoryStorage();

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
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

// Helper function to upload file to S3
exports.uploadToS3 = async (file, folder = 'surplus-packages') => {
    try {
        const fileExtension = path.extname(file.originalname);
        const key = `${folder}/${uuidv4()}${fileExtension}`;

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
        throw new Error(`S3 upload failed: ${error.message}`);
    }
};

// Helper function to delete file from S3
exports.deleteFromS3 = async (url) => {
    try {
        if (!url) return;

        // Extract key from URL
        const key = url.split('.amazonaws.com/')[1];
        if (!key) return;

        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
        console.log('File deleted from S3:', key);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
    }
};

