/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/service/auth.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionToken = request.headers('x-session-token');

    if (!sessionToken) {
      throw new UnauthorizedException('Session token required');
      return false;
    }

    try {
      const session = await this.authService.validateSessionToken(sessionToken);
      if (!session.valid || !session.user) {
        throw new UnauthorizedException('Invalid session token');
      }
      request.user = session.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session token');
    }
  }
}
