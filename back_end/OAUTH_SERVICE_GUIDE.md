# Guide d'ajout d'un nouveau service OAuth

Si vous souhaitez ajouter un nouveau service OAuth (Spotify, Twitter, etc.), suivez ces étapes pour que la redirection vers la page de succès fonctionne correctement.

## Étapes à suivre

### 1. Créer la stratégie Passport

Créez un fichier de stratégie dans `/back_end/src/app/oauth2/services/[service-name]/`

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-[service]';

@Injectable()
export class ServiceStrategy extends PassportStrategy(Strategy, 'service-name') {
  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.service_client_id,
      clientSecret: envConstants.service_client_secret,
      callbackURL: callbackOf(services.service.slug),
      scope: ['email', 'profile'],
    };

    super(options);
  }

  validate(accessToken: string, refreshToken: string, profile: any): ServiceProvider {
    return {
      connection_name: services.service.name,
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.username ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: ['email', 'profile'],
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
    };
  }
}
```

### 2. Créer le Guard

Créez `/back_end/src/app/oauth2/services/[service-name]/[service].guard.ts`

```typescript
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';
import { ServiceProvider, ServiceProviderRequest } from './[service].dto';

@Injectable()
export class ServiceOAuthGuard extends AuthGuard('service-name') {
  /**
   * Override getAuthenticateOptions to pass the JWT token as state parameter
   * This allows the token to be preserved through the OAuth flow
   */
  getAuthenticateOptions(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest<Request>();
    const tokenFromQuery = request.query.token as string;
    
    if (tokenFromQuery) {
      return {
        state: tokenFromQuery,
      };
    }
    return {};
  }

  handleRequest<TUser = JwtPayload>(
    err: unknown,
    user: ServiceProvider,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    const req: ServiceProviderRequest = context.switchToHttp().getRequest();
    req.provider = user;
    return req.user as TUser;
  }
}
```

### 3. Ajouter les routes dans le contrôleur

Dans `/back_end/src/app/oauth2/oauth2.controller.ts`, ajoutez :

```typescript
import { ServiceOAuthGuard } from '@app/oauth2/services/[service-name]/[service].guard';

@Controller('oauth2')
export class Oauth2Controller {
  // ... constructeur existant

  @Get(services.servicename.slug)
  @UseGuards(JwtOAuthGuard, ServiceOAuthGuard)
  async serviceAuth() {}

  @Get(`${services.servicename.slug}/callback`)
  @UseGuards(JwtOAuthGuard, ServiceOAuthGuard)
  async serviceAuthRedirect(
    @Req() req: StrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    if (!req.user) throw new UnauthenticatedException();

    if (!req.provider) {
      console.error(`Service provider not found for user ${req.user.userId}.`);
      throw new InternalServerErrorException();
    }

    await this.connectionService.createConnection(
      services.servicename.name,
      req.user.userId,
      req.provider,
    );

    // Redirect to success page instead of returning JSON
    return res.redirect(envConstants.web_oauth2_success_redirect_url);
  }
}
```

### 4. Ajouter les variables d'environnement

Dans `/back_end/.env` et `/back_end/.env.example` :

```bash
SERVICE_CLIENT_ID="votre_client_id"
SERVICE_CLIENT_SECRET="votre_client_secret"
```

Dans `/back_end/src/config/env.ts` :

```typescript
export const envConstants = {
  // ... autres variables
  service_client_id: process.env.SERVICE_CLIENT_ID ?? 'SERVICE_CLIENT_ID',
  service_client_secret: process.env.SERVICE_CLIENT_SECRET ?? 'SERVICE_SECRET',
};
```

### 5. Enregistrer le module

Dans `/back_end/src/app/oauth2/oauth2.module.ts` :

```typescript
import { ServiceStrategy } from './services/[service-name]/[service].strategy';
import { ServiceOAuthGuard } from './services/[service-name]/[service].guard';

@Module({
  imports: [/* ... */],
  providers: [
    // ... autres providers
    ServiceStrategy,
    ServiceOAuthGuard,
  ],
  controllers: [Oauth2Controller],
})
export class Oauth2Module {}
```

## Points importants

### ✅ À faire
- Toujours utiliser `@Res() res: express.Response` dans la signature
- Toujours appeler `res.redirect(envConstants.web_oauth2_success_redirect_url)` après avoir créé la connexion
- Vérifier que `req.user` et `req.provider` existent avant de continuer
- Passer le JWT token via le paramètre `state` dans le Guard

### ❌ À éviter
- Ne pas retourner de JSON dans le callback (cela afficherait du JSON au lieu de la page de succès)
- Ne pas oublier d'importer `express` avec `import type * as express from 'express'`
- Ne pas oublier les guards `JwtOAuthGuard` et `ServiceOAuthGuard`

## Template de DTO

Créez `/back_end/src/app/oauth2/services/[service-name]/[service].dto.ts` :

```typescript
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

export interface ServiceProvider extends OAuth2Provider {
  // Ajoutez des champs spécifiques au service si nécessaire
}

export interface ServiceProviderRequest extends Request {
  provider: ServiceProvider;
  user: JwtPayload;
}
```

## Exemple complet

Référez-vous aux implémentations existantes :
- Gmail : `/back_end/src/app/oauth2/services/gmail/`
- Discord : `/back_end/src/app/oauth2/services/discord/`
- GitHub : `/back_end/src/app/oauth2/services/github/`

Ces implémentations suivent toutes le même pattern et redirigent vers la page de succès.
