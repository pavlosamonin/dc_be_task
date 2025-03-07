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

    // Send progress updates to clients
    sendProgressUpdate(progress: string): void {
        this.sendMessage({
            event: 'progress',
            data: { message: progress }
        });
    }

    // Send a message to clients
    sendMessage(message: { event: string, data: any }): void {
        // Broadcasting the message to all connected clients
        this.server.emit(message.event, message.data);
    }

    // Called when a client connects
    handleConnection(client: Socket): void {
        this.clients.add(client);
    }

    // Called when a client disconnects
    handleDisconnect(client: Socket): void {
        this.clients.delete(client);
    }

    // Emit events to all connected clients
    sendEvents(): void {
        const eventData = {
            message: 'Directory scanning started...',
            timestamp: new Date().toISOString(),
        };

        // Broadcasting the event to all connected clients
        this.server.emit('directoryScanEvent', eventData);
    }
}
