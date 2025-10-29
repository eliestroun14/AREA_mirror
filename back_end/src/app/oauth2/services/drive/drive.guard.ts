import { Injectable } from '@nestjs/common';
import { AREA_AuthGuard } from '@app/oauth2/services/service.guard';

@Injectable()
export class DriveOAuthGuard extends AREA_AuthGuard('google') {}
