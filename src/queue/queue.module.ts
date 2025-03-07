import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import {ConfigModule} from "../config/config.module";
import {RedisModule} from "../redis/redis.module";

@Module({
    imports: [ConfigModule, RedisModule],
    providers: [QueueService],
    exports: [QueueService],
})
export class QueueModule {}
