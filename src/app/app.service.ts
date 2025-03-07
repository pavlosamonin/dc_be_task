import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class AppService implements OnModuleInit {
    private readonly logger = new Logger(AppService.name);

    constructor(@Inject(QueueService) private readonly queueService: QueueService) {}

    // Called when the module is initialized
    async onModuleInit() {
        this.logger.log('Sending directory scan request to queue...');
        await this.queueService.sendDirectoryScanRequest();
    }
}

