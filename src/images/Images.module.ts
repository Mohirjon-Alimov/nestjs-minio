import { Module } from '@nestjs/common';
import { ImagesController } from './Image.controller';
import { MinioModule } from '../minio/Minio.module';

@Module({
  imports: [MinioModule],
  controllers: [ImagesController],
})
export class ImagesModule {}
