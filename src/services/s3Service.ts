// src/services/S3Service.ts
import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_BUCKET_NAME || '';
  }

  public async uploadFile(file:Express.Multer.File): Promise<string> {
    const params: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: file.originalname, // or a unique key for the file
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const data = await this.s3.upload(params).promise();
      return data.Location; // URL of the uploaded file
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

export default S3Service;
