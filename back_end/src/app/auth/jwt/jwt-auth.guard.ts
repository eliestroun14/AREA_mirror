import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

}
