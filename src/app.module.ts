import { Module } from '@nestjs/common';
import { ImagesModule } from './images/Images.module';
import { MinioModule } from './minio/Minio.module';

@Module({
  imports: [ImagesModule, MinioModule],
})
export class AppModule {}
