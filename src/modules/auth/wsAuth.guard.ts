import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Reflector } from '@nestjs/core';
  import { USER_INFO_KEY, jwtConstants } from 'src/core/misc/consts';
  import { Socket } from 'socket.io';
  
  @Injectable()
  export class WsAuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private readonly reflector: Reflector,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.get<boolean>(
        'isPublic',
        context.getHandler(),
      );
      const isProvider = this.reflector.get<boolean>(
        'isProvider',
        context.getHandler(),
      );
  
      if (isPublic) return true;
  
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
  
      let errMsg = 'Unauthorized user.';
  
      if (!token) throw new BadRequestException(errMsg);
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secure,
        });
  
        if (isProvider && payload.domain != 2) {
          errMsg = 'Unauthorized user domain.';
          throw new BadRequestException(errMsg);
        }
        // Attach payload to client object for later use
        client.data.user = payload;
      } catch (e) {
        throw new BadRequestException(errMsg);
      }
      return true;
    }
  }
  