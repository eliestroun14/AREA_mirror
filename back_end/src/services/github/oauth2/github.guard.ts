import { Injectable } from '@nestjs/common';
import { AREA_AuthGuard } from '@app/oauth2/services/service.guard';

@Injectable()
export class GithubOAuthGuard extends AREA_AuthGuard('github') {}
