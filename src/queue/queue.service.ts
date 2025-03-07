import * as amqp from 'amqplib';
import {Inject, Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "../config/config.service";

@Injectable()
export class QueueService {
    private readonly logger = new Logger(QueueService.name);
    private readonly scanQueue = 'scanQueue';

    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

    // Send a directory scan request to the queue
    async sendDirectoryScanRequest() {
        const amqpUrl = this.configService.get<string>('AMQP_URL');
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(this.scanQueue, { durable: true });

        channel.sendToQueue(this.scanQueue, Buffer.from('directory_scan_request'));
        this.logger.log('Directory scan request sent to queue.');

        await channel.close();
        await connection.close();
    }
}
