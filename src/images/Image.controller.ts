import { Controller, Get, Param, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MinioService } from '../minio/Minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('images')
export class ImagesController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.minioService.uploadFile(file);
  }

  @Get(':fileName')
  async getImage(@Param('fileName') fileName: string, @Res({ passthrough: true }) res: Response) {
    try {
      const fileStream = await this.minioService.getFile(fileName).catch(err => console.log(1234, err, 4312));

      if (!fileStream) {
        // todo: change format to response service
        return 'file not found';
      }

      res.set({
        'Content-Type': fileStream.metaData.metaData['content-type'] || 'application/octet-stream',
        'Content-Length': fileStream.metaData.size.toString(),
      });

      return new StreamableFile(fileStream.stream);
    } catch (error) {
      console.log(error);
    }
  }
}
