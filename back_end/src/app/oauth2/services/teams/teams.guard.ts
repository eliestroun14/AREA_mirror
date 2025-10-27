import { AuthGuard } from '@nestjs/passport';

export class TeamsOAuthGuard extends AuthGuard('teams') {}
