import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { RedisModule } from '../redis/redis.module';
import { QueueModule } from '../queue/queue.module';
import { AppService } from './app.service';
import { SearchModule } from '../search/search.module';
import {FileScannerModule} from "../file-scanner/file-scanner.module";
import {EventEmitterModule} from "@nestjs/event-emitter";

@Module({
    imports: [
        ConfigModule,
        RedisModule,
        QueueModule,
        SearchModule,
        FileScannerModule,
        EventEmitterModule.forRoot()
    ],
    providers: [AppService],
})
export class AppModule {}
