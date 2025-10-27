Documentation des services
----

# Quick Start

## Ajout dans la base de donnée

Pour ajouter un service dans la base de donnée, il faut dans un premier temps l'ajouter dans le fichier [src/prisma/service-data/service.data.ts](/back_end/src/prisma/services-data/services.data.ts), dans la liste `servicesData` :

```typescript
// [...]

const servicesData: Service[] = [
  
  // [...]
    
  {
    name:               'Gmail',                    // Nom du service
    serviceColor:       '#1C1C1C',                  // Couleur du service 
                                                    //      (Le logo du service doit être visible avec cette couleur en fond)
    iconUrl:            '/assets/gmail.png',        // Logo du service
    apiBaseUrl:         'https://api.gmail.com',    // URL de l'API
    authType:           'oauth2',                   // Type d'authentification (oauth2 / api_key / basic)
    documentationUrl:   'none',                     // URL vers la documentation de l'API
    isActive:           true,                       // Si false, alors le service ne sera pas renvoyé dans les requêtes.
    triggers:           [],                         // Liste des triggers associées
    actions:            [],                         // Liste des actions associées
  },
];

// [...]
```

## Ajout des routes d'authentification

Pour ajouter une route d'authentification à un service (OAuth2), et ainsi permettre à l'utilisateur de relier son compte
sur le service en question avec l'AREA, suivez les étapes suivantes :

1. Ajouter les informations de connexion à l'application OAuth dans le fichier [/src/config/env.ts](/back_end/src/config/env.ts) :
```typescript
export const envConstants = {
  // ...
  web_oauth2_success_redirect_url:
    process.env.WEB_SUCCESS_OAUTH2_REDIRECT_URL ??
    'http://127.0.0.1/oauth2/success',

  <service_name>_client_id: process.env.<SERVICE_NAME>_CLIENT_ID ?? '<SERVICE_NAME>_CLIENT_ID',
  <service_name>_client_secret: process.env.<SERVICE_NAME>_CLIENT_SECRET ?? '<SERVICE_NAME>_SECRET',
};
```
2. Télécharger la dépendence correspondante sur [passportjs](https://www.passportjs.org/packages/).
3. Créer un dossier `/src/app/oauth2/services/[service-name]`. *(Exemple : `oauth2/services/discord)*
4. Ajouter dans ce nouveau dossier un fichier `<service-name>.dto.ts` avec le code suivant :
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';

/**
 * Informations du provider Discord après authentification OAuth2
 */
export class <ServiceName>Provider extends OAuth2Provider {
  provider_custom_field_1: string;
  provider_custom_field_2: string;
}

/**
 * Requête contenant les informations <ServiceName> après OAuth2
 * (Utilisé en interne)
 */
export interface <ServiceName>ProviderRequest extends JwtRequest {
  provider: <ServiceName>Provider;
}
```
5. Ajouter dans ce nouveau dossier un fichier `[service-name].strategy.ts` avec le code suivant :
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-<service-name>'; // L'import dépend de passportjs !
import { <ServiceName>Provider } from '@app/oauth2/services/<service-name>/<service-name>.dto';
import { envConstants } from '@config/env';
import { callbackOf } from '@config/utils';
import { services } from '@root/prisma/services-data/services.data';

@Injectable()
export class <ServiceName>Strategy extends PassportStrategy(Strategy, '<service-name>') {
  private static SCOPES: string[] = ['email'];

  constructor() {
    const options: StrategyOptions = {
      clientID: envConstants.<service_name>_client_id,
      clientSecret: envConstants.<service_name>_client_secret,
      callbackURL: callbackOf(services.<serviceName>.slug),
      scope: <ServiceName>Strategy.SCOPES,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): <ServiceName>Provider {
    // Les fields `profile.XXX` dépendent de ce que propose le service !
    return {
      connection_name: services.<service-name>.name,
      account_identifier: profile.id,
      email: profile.emails?.[0]?.value ?? 'none',
      username: profile.username ?? '',
      picture: profile.photos?.[0]?.value ?? '/assets/placeholder.png',
      rate_limit_remaining: undefined,
      rate_limit_reset: null,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: null,
      scopes: <ServiceName>Strategy.SCOPES,
    };
  }
}
```
6. Ajouter, dans le fichier [`/src/app/oauth2/oauth2.controller.ts`](/back_end/src/app/oauth2/oauth2.controller.ts), la route d'authentification et le callback :
```typescript

@ApiTags('oauth2')
@Controller('oauth2')
export class Oauth2Controller {
  constructor(
    private service: Oauth2Service,
    private connectionService: ConnectionsService,
  ) {}

  // [...]

  @Get(services.<serviceName>.slug)
  @UseGuards(JwtOAuthGuard, GmailOAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Initier l'authentification OAuth2 avec <ServiceName>",
    description:
      'Redirige l\'utilisateur vers la page d\'authentification <ServiceName> pour connecter son compte <ServiceName>. Nécessite un token JWT dans le query param "token".',
  })
  @ApiQuery({
    name: 'token',
    description: "Token JWT de l'utilisateur",
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers <ServiceName> OAuth2',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT manquant ou invalide',
  })
  async <serviceName>Auth() {}
  
  @Get(`${services.<serviceName>.slug}/callback`)
  @UseGuards(JwtOAuthGuard, <ServiceName>OAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Callback OAuth2 <ServiceName>',
    description:
      'Endpoint de callback après authentification <ServiceName>. Enregistre la connexion <ServiceName> et redirige vers la page de succès.',
  })
  @ApiQuery({
    name: 'code',
    description: "Code d'autorisation OAuth2 retourné par <ServiceName>",
    required: true,
  })
  @ApiQuery({
    name: 'state',
    description: "Token JWT de l'utilisateur (passé dans le state OAuth2)",
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers la page de succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 500,
    description: "Erreur lors de l'enregistrement de la connexion",
  })
  async <serviceName>AuthRedirect(
    @Req() req: StrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    if (!req.user) throw new UnauthenticatedException();
  
    await this.connectionService.createConnection(
      services.gmail.name,
      req.user.userId,
      req.provider,
    );
  
    // Redirect to success page instead of returning JSON
    return res.redirect(envConstants.web_oauth2_success_redirect_url);
  }
}
```

## Ajout d'un trigger

1. Créer le dossier `/src/runner/services/<service-name>`.
2. Créer un fichier `<service-name>.dto.ts` dans ce même dossier.
3. Ajouter la classe du payload dans ce fichier. Cela correspond aux données que l'utilisateur va rentrer sur la page du front-end. Par exemple, pour le scheduling toutes les X secondes :
```typescript
export interface <ServiceName>Trigger_<TriggerName>_Payload {
    payload_field_1: string;
    payload_field_2: number;
}
```
4. Créer un fichier `<service-name>.dto.ts` dans ce même dossier.
5. Ajouter la classe du workflow de ce trigger. Par exemple, pour le scheduling toutes les X secondes :
```typescript
import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { TriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { TriggerRunnerJob } from '@root/runner/zaps/triggers/triggers.runner.job';
import { <ServiceName>Trigger_<TriggerName>_Payload } from '@root/runner/services/<service-name>/<service-name>.dto';

export class <ServiceName>Trigger_<TriggerName> extends TriggerRunnerJob<<ServiceName>Trigger_<TriggerName>_Payload> {
  constructor(params: TriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<RunnerCheckResult> {
    // Attributs utiles de la classe
    this.lastExecution; // Date | null
    this.accessToken;   // string | null
    this.payload;       // <ServiceName>Trigger_<TriggerName>_Payload


    // Données des variables retournées par le trigger
    const data = [{ key: 'VariableKey', value: 'value' }];

    // Si le trigger s'est déclenché, renvoyer les données suivantes :
    return {
      status: RunnerExecutionStatus.SUCCESS,
      data,
      is_triggered: true,
    };
      
    // Si le trigger ne s'est pas déclenché, sans provoquer d'erreur :
    return {
      status: RunnerExecutionStatus.SUCCESS,
      data: [],
      is_triggered: false,
    };
      
    // Si le trigger ne s'est pas déclenché, en provoquant une erreur :
    return {
      status: RunnerExecutionStatus.FAILURE,
      data: [],
      is_triggered: false,
    };
  }
}
```
6. Ajouter la classe dans le fichier [`/src/runner/zaps/triggers/triggers.runner.factory.ts`](/back_end/src/runner/zaps/triggers/triggers.runner.factory.ts) :
```typescript
// [...]

export class TriggersRunnerFactory {
  private registers: Record<string, TriggerBuilderFunction> = {
    // [...]

    <ServiceName>Trigger_<TriggerName>: (builder: TriggerBuilderParams) => {
      return new <ServiceName>Trigger_<TriggerName>(builder);
    },
  };
  // [...]
}
```
7. Ajouter le trigger dans la liste des triggers du service associé dans le fichier [`/src/prisma/services-data/services.data.ts`](/back_end/src/prisma/services-data/services.data.ts) :
```typescript

export const servicesData: Service[] = [
  {
    name: '<ServiceName>',
    // [...]
    triggers: [
      {
        class_name: '<ServiceName>Trigger_<TriggerName>',
        http_requests: null,            // Si un http_request est requis
        webhook: null,                  // Si un webhook est requis
        trigger_type: 'POLLING',        // 'POLLING' / 'WEBHOOK' 
        name: 'Nom du trigger',
        description: 'Description du trigger',
        polling_interval: 1000,         // Interval du polling en milliseconde
        fields: {                       // Champs du trigger
          seconds: {
            key: 'Seconds',                     // Clé du champs
            required: true,                     // Valeur requise ou non
            type: 'number',                     // Type de champs
            select_options: [],                 // Options de la sélection
            field_name: 'Interval of seconds',  // Nom du champs
            default_value: '10',                // Valeur par défaut
            placeholder: '10',                  // Placeholder
            field_order: 0,                     // Ordre de placement.
                                                // Un field_order de 0 sera placé au dessus d'un field_order de 1
            validation_rules: {},               // Non requis pour le moment.
            is_active: true,                    // Définir à false pour cacher le champs.
          },
        },
        variables: [            // Variables utilisables dans les actions qui dépendent de ce step.
          {
            type: 'string',     // Type de la variable.
            key: 'date',        // Clé de la variable. (Inutile dans la logique actuelle)
            name: 'Date',       // Nom de la variable.
          },
        ],
        is_active: true,                  // Définir à false pour cacher le trigger.
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      },
    ],
    actions: [
      // [...]
    ],
  },
  // [...]
}
```
