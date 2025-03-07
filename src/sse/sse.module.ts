import { Module } from '@nestjs/common';
import { SseGateway } from './sse.gateway';

@Module({
    providers: [SseGateway],
    exports: [SseGateway],
})
export class SseModule {}
