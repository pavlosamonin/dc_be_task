import { Module } from '@nestjs/common';
import { FileScannerService } from './file-scanner.service';
import { RedisService } from '../redis/redis.service';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [ConfigModule],
    providers: [FileScannerService, RedisService],
    exports: [FileScannerService],
})
export class FileScannerModule {}
