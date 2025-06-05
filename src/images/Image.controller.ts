import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MinioService } from '../minio/Minio.service';
import { defineBase64ImageExtension } from '../utils';

@Controller('images')
export class ImagesController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  async uploadImage(@Body() body: { encodedImage: string; filename: string }) {
    const { encodedImage, filename } = body;
    const extensionName = defineBase64ImageExtension(encodedImage);

    if (!extensionName) throw new Error('Wrong file extension');

    const objectName = await this.minioService.uploadBase64Image(encodedImage, filename, extensionName);
    return {
      success: true,
      objectName,
      message: 'Image uploaded successfully',
    };
  }

  @Get(':filename')
  async getImageUrl(@Param('filename') filename: string) {
    const url = await this.minioService.getImageUrl(filename);
    return { url };
  }
}
