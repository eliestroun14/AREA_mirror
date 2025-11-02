import { Injectable } from '@nestjs/common';
import { AREA_AuthGuard } from '@app/oauth2/services/service.guard';
import { constants } from '@config/utils';

@Injectable()
export class GoogleOauthLoginOAuthGuard extends AREA_AuthGuard(
  constants.services.googleOauthLogin.slug,
  false,
) {}
