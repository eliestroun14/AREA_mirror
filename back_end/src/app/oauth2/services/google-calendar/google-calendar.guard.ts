import { Injectable } from '@nestjs/common';
import { AREA_AuthGuard } from '@app/oauth2/services/service.guard';

@Injectable()
export class GoogleCalendarOAuthGuard extends AREA_AuthGuard('google-calendar') {}
