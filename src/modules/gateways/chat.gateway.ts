// src/gateways/chat.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { ActiveUsersService } from './active-users.service';
import { WsAuthGuard } from '../auth/wsAuth.guard';

@Injectable()
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*', // Adjust this to your frontend URL in production
    methods: ['GET', 'POST'],
  },
})
@UseGuards(WsAuthGuard) 
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly activeUsersService: ActiveUsersService) {}

  handleConnection(client: Socket) {
    this.activeUsersService.increment();
    const activeUsers = this.activeUsersService.getActiveUsers();
    // console.log(`Client connected: ${client.id}. Site Active Users: ${activeUsers}`);
    // Removed: this.server.of('/admin').emit('activeUsers', { count: activeUsers });
  }

  handleDisconnect(client: Socket) {
    this.activeUsersService.decrement();
    const activeUsers = this.activeUsersService.getActiveUsers();
    // console.log(`Client disconnected: ${client.id}. Site Active Users: ${activeUsers}`);
    // Removed: this.server.of('/admin').emit('activeUsers', { count: activeUsers });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
    // Broadcast the message to all clients in the /chat namespace
    this.server.emit('message', data);
  }

  sendMessage(event: string, data: any) {
    this.server.emit(event, data);
  }
}
