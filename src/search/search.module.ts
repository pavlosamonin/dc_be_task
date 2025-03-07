import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { RedisModule } from '../redis/redis.module';
import {QueueModule} from "../queue/queue.module";
import {SseGateway} from "../sse/sse.gateway";
import {SseModule} from "../sse/sse.module";
import {FileScannerModule} from "../file-scanner/file-scanner.module";

@Module({
    imports: [RedisModule, QueueModule, SseModule],
    controllers: [SearchController],
    providers: [SearchService, SseGateway],
    exports: [SearchService]
})
export class SearchModule {}
