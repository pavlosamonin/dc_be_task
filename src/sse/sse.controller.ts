import { Controller, Get } from '@nestjs/common';
import { SseGateway } from './sse.gateway';

@Controller('sse')
export class SseController {
    constructor(private readonly sseGateway: SseGateway) {}

    @Get('send-events')
    sendEvents(): void {
        this.sseGateway.sendEvents();
    }
}
