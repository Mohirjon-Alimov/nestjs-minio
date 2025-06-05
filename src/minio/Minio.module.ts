import { Module } from '@nestjs/common';
import { MinioService } from './Minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
