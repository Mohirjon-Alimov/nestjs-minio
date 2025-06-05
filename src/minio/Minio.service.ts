import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: `${process.env.MINIO_ENDPOINT}`,
      port: parseInt(`${process.env.MINIO_PORT}`),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });

    this.bucketName = process.env.MINIO_BUCKET_NAME || 'images';
    this.initializeBucket().then();
  }

  private async initializeBucket() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
    }
  }

  async uploadBase64Image(base64Data: string, fileName: string, extensionName: string): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');

    const metaData = {
      'Content-Type': `image/${extensionName}`,
    };

    const result = await this.minioClient.putObject(this.bucketName, fileName, buffer, null, metaData);

    console.log(11, result, 22);

    return fileName;
  }

  async getImageUrl(objectName: string): Promise<string> {
    return this.minioClient.presignedUrl('GET', this.bucketName, objectName, 999);
  }
}
