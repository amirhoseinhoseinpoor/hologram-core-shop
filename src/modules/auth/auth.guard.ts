import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { USER_INFO_KEY, jwtConstants } from 'src/core/misc/consts';

@Injectable()
export class AuthGuard implements CanActivate {
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

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

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
      request[USER_INFO_KEY] = payload;
    } catch (e) {
      throw new BadRequestException(errMsg);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
