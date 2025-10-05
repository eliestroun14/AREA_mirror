import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { envConstants } from '@config/env';
import { Request } from 'express';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => JwtStrategy.extractJWT(req),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      secretOrKey: envConstants.jwtSecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'session_token' in req.cookies &&
      typeof req.cookies.session_token === 'string' &&
      req.cookies.session_token.length > 0
    ) {
      return req.cookies.session_token;
    } else if (
      req.headers &&
      'authorization' in req.headers &&
      typeof req.headers.authorization === 'string' &&
      req.headers.authorization.length > 0
    ) {
      const authHeader = req.headers.authorization;
      // Remove "Bearer " prefix if present
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        return token;
      }
      return authHeader;
    }
    console.log('⚠️ No JWT found');
    return null;
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
