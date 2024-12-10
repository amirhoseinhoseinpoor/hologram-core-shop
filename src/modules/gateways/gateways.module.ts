// src/gateways/gateways.module.ts

import { Module, Global } from '@nestjs/common';
import { ActiveUsersGateway } from './active-users.gateway';
import { ActiveUsersService } from './active-users.service';
import { ChatGateway } from './chat.gateway';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ActiveUsersGateway, ChatGateway, ActiveUsersService],
  exports: [ActiveUsersService, ChatGateway, ActiveUsersGateway],
})
export class GateWaysModule {}
