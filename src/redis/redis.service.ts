import {Inject, Injectable, Logger} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RedisService {
    private redisClient: RedisClientType;
    private readonly logger = new Logger(RedisService.name);

    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL');
        this.redisClient = createClient({ url: redisUrl });
        this.redisClient.connect().catch((err) => this.logger.error('Failed to connect to Redis:', err));
    }

    async getKeys(pattern: string): Promise<string[]> {
        return await this.redisClient.keys(pattern);
    }

    async getFileIndex(fileName: string): Promise<string | null> {
        return await this.redisClient.get(fileName);
    }

    async getFilesByContent(searchText: string): Promise<string[]> {
        const keys = await this.redisClient.keys('file:*');
        const matchingFiles: string[] = [];

        for (const key of keys) {
            const content = await this.redisClient.get(key);
            if (content && content.includes(searchText)) {
                matchingFiles.push(key.replace('file:', ''));
            }
        }

        return matchingFiles;
    }

    async storeFileIndex(fileName: string, content: string): Promise<void> {
        await this.redisClient.set(`file:${fileName}`, content);
        this.logger.log(`Indexed file in Redis: ${fileName}`);
    }


    async setFileIndex(fileName: string, content: string): Promise<void> {
        await this.redisClient.set(`file:${fileName}`, content);
    }

    async close() {
        await this.redisClient.quit();
    }
}
