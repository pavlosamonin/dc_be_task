import { Injectable } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
})
export class SseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server!: Server;

    private clients: Set<Socket> = new Set();

    sendProgressUpdate(progress: string): void {
        this.sendMessage({
            event: 'progress',
            data: { message: progress }
        });
    }

    sendMessage(message: { event: string, data: any }): void {
        this.server.emit(message.event, message.data);
    }

    handleConnection(client: Socket): void {
        this.clients.add(client);
    }

    handleDisconnect(client: Socket): void {
        this.clients.delete(client);
    }

    sendEvents(): void {
        const eventData = {
            message: 'Directory scanning started...',
            timestamp: new Date().toISOString(),
        };

        this.server.emit('directoryScanEvent', eventData);
    }
}
