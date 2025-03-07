import * as amqp from 'amqplib';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '../config/config.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FileScannerService implements OnModuleInit {
    private readonly logger = new Logger(FileScannerService.name);
    private readonly scanQueue = 'scanQueue';
    private readonly rootDirectory: string;

    constructor(
        @Inject(RedisService) private readonly redisService: RedisService,
        @Inject(ConfigService) private readonly configService: ConfigService,
        @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2
    ) {
        this.rootDirectory = this.configService.get<string>('SCAN_ROOT', './text-files');
    }

    async onModuleInit() {
        this.logger.log('Starting file scan on app startup...');
        await this.scanAndStoreFiles();
        await this.startQueueConsumer();
    }

    private async startQueueConsumer() {
        const amqpUrl = this.configService.get<string>('AMQP_URL', 'amqp://localhost');
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(this.scanQueue, { durable: true });

        channel.consume(this.scanQueue, async (msg) => {
            if (msg && msg.content.toString() === 'directory_scan_request') {
                this.logger.log('Received directory scan request.');
                await this.scanAndStoreFiles();
                channel.ack(msg);
            }
        });

        this.logger.log('Waiting for directory scan requests...');
    }

    private async scanAndStoreFiles() {
        this.logger.log(`Scanning directory: ${this.rootDirectory}`);

        try {
            const files = await fs.promises.readdir(this.rootDirectory);
            for (const file of files) {
                const filePath = path.join(this.rootDirectory, file);
                const stats = await fs.promises.stat(filePath);

                if (stats.isFile()) {
                    const fileName = path.basename(filePath);
                    this.logger.log(`Found file: ${fileName}`);

                    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
                    await this.redisService.storeFileIndex(fileName, fileContent);
                }
            }
            this.logger.log('File scanning and indexing completed.');

            this.eventEmitter.emit('scanComplete');

        } catch (error) {
            this.logger.error(`Error scanning directory: ${(error as Error).message}`);
        }
    }
}
