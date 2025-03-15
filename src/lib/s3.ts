import { S3Client } from '@aws-sdk/client-s3';

if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID || 
    !import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || 
    !import.meta.env.VITE_AWS_REGION || 
    !import.meta.env.VITE_S3_BUCKET) {
  throw new Error('Missing AWS environment variables');
}

export const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const bucketName = import.meta.env.VITE_S3_BUCKET;