// src/gateways/active-users.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ActiveUsersService } from './active-users.service';

@Injectable()
@WebSocketGateway({
  namespace: '/admin',
  cors: {
    origin: '*', // Replace with your admin panel's URL in production
    methods: ['GET', 'POST'],
  },
})
export class ActiveUsersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly activeUsersService: ActiveUsersService) {}

  afterInit(server: Server) {
    // Subscribe to activeUsers changes and emit to /admin namespace
    this.activeUsersService.activeUsers$.subscribe((count) => {
      this.server.emit('activeUsers', { count });
    });
  }

  handleConnection(client: Socket) {
    //   console.log(`Admin connected: ${client.id}`);
    // Optionally, send the current active users count upon connection
    client.emit('activeUsers', {
      count: this.activeUsersService.getActiveUsers(),
    });
  }

  handleDisconnect(client: Socket) {
    //   console.log(`Admin disconnected: ${client.id}`);
    // Handle admin disconnection logic if necessary
  }
}
