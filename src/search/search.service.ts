import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { SseGateway } from '../sse/sse.gateway';
import { QueueService } from "../queue/queue.service";
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SearchService {
    private readonly logger = new Logger(SearchService.name);

    constructor(
        @Inject(RedisService) private readonly redisService: RedisService,
        @Inject(QueueService) private readonly queueService: QueueService,
        @Inject(SseGateway) private readonly sseGateway: SseGateway,
        @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2
    ) {}

    async searchFiles(searchText: string): Promise<{ files: string[] }> {
        this.logger.log(`Search started for: ${searchText}`);
        this.sseGateway.sendProgressUpdate('Search started');

        let result: string[] = await this.performSearch(searchText);

        if (result.length === 0) {
            this.logger.warn(`No matching files found in Redis for: ${searchText}, sending directory scan request...`);
            await this.queueService.sendDirectoryScanRequest(); // Request directory scan

            await new Promise<void>((resolve) => {
                this.logger.log('Waiting for scanComplete event...');
                this.eventEmitter.once('scanComplete', () => {
                    this.logger.log('Received scanComplete event');
                    resolve();
                });
            });

            this.logger.log(`Retrying search after scan completion for: ${searchText}`);
            result = await this.performSearch(searchText);
        }

        this.sseGateway.sendProgressUpdate('Search completed');
        return { files: Array.from(new Set(result)) };
    }

    private async performSearch(searchText: string): Promise<string[]> {
        let result: string[] = [];
        const fileNames = await this.redisService.getKeys('file:*');
        const matchingFileNames = fileNames.filter(fileName => fileName.includes(searchText));
        result.push(...matchingFileNames.map(fileName => fileName.replace('file:', '')));

        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i].replace('file:', '');
            const content = await this.redisService.getFileIndex(fileNames[i]);
            if (content && content.includes(searchText)) {
                result.push(fileName);
            }

            const progress = `Searching: ${i + 1} / ${fileNames.length} files processed`;
            this.sseGateway.sendProgressUpdate(progress);
        }
        return result;
    }
}
