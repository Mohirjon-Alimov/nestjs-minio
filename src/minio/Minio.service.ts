import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Readable } from 'node:stream';

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
    this.initializeBucket().catch(err => console.log('init error', err));
  }

  private async initializeBucket() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const metaData = {
      'Content-Type': file.mimetype,
    };

    await this.minioClient.putObject(this.bucketName, file.originalname, file.buffer, file.size, metaData);

    return file.originalname;
  }

  async getFile(fileName: string): Promise<{ stream: Readable; metaData: Minio.BucketItemStat }> {
    const metaData = await this.minioClient.statObject(this.bucketName, fileName);
    const stream = await this.minioClient.getObject(this.bucketName, fileName);
    return { stream, metaData };
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
