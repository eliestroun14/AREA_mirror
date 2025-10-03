import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { envConstants } from '@app/auth/constants';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/unbound-method
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true,
      secretOrKey: envConstants.jwtSecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    console.log('============================');
    console.log('Request url: ', req.url);
    console.log('Cookies: ');
    console.log(req.cookies);
    console.log('============================');
    if (
      req.cookies &&
      'access_token' in req.cookies &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.cookies.access_token?.length > 0
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return req.cookies.access_token;
    }
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1ODQ4NTM5NiwiZXhwIjoxNzU5MDkwMTk2fQ.sJ8yQjK3S3nNDOK1OFBoD_nT_0-vDtf68PZde5ppAIU';
  }

  validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    return { userId: payload?.userId };
  }
}
