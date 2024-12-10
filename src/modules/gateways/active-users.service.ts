// src/gateways/active-users.service.ts

import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class ActiveUsersService {
  private activeUsers: number = 0;
  private activeUsersSubject = new Subject<number>();

  activeUsers$ = this.activeUsersSubject.asObservable();

  increment() {
    this.activeUsers++;
    this.activeUsersSubject.next(this.activeUsers);
  }

  decrement() {
    this.activeUsers = Math.max(this.activeUsers - 1, 0);
    this.activeUsersSubject.next(this.activeUsers);
  }

  getActiveUsers() {
    return this.activeUsers;
  }
}
