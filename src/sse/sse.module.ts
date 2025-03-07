import { Module } from '@nestjs/common';
import { SseGateway } from './sse.gateway';

@Module({
    providers: [SseGateway],
    exports: [SseGateway],  // Export the SseGateway to make it available in other modules
})
export class SseModule {}
