Documentation des services
----

# Quick Start

## AVANT D'AJOUTER UN SERVICE

S'assurer que l'authentification par stratégie est disponible sur [passportjs](https://www.passportjs.org/).
Pour cela, chercher la stratégie du service en question sur [passportjs](https://www.passportjs.org/).

> [!IMPORTANT]
> Dans ce tutoriel, vous trouverez des fichiers d'exemples avec parfois `<service-name>`, parfois `<serviceName>`, parfois `<ServiceName>`, etc..
> Il est **OBLIGATOIRE** de respecter le format de chacune de ces placeholders.
> 
> Par exemple, pour le service Microsoft Teams, le format `<ServiceName>` sera `MicrosoftTeams`, et le format `<service-name>` sera `microsoft-teams`.

## Application du service

Pour créer un service, il faudra d'abord créer une application sur ce service.
Cette application vous permettra d'obtenir un `CLIENT_ID` et un `CLIENT_SECRET`.

Ces identifiants doivent être sauvegardés dans le fichier `back_end/src/config/env.ts`, dans la variable `envConstants` :
```env
<SERVICE_NAME>_CLIENT_ID="..."
<SERVICE_NAME>_CLIENT_SECRET="..."
```

Ils seront récupérés dans le fichier `back_end/src/config/env.ts`, dans la variable `envConstants` :
```typescript
export const envConstants = {
    // ...
    
    <service_name>_client_id: process.env.<SERVICE_NAME>_CLIENT_ID ?? '<SERVICE_NAME>_CLIENT_ID',
    <service_name>_client_secret: process.env.<SERVICE_NAME>_CLIENT_SECRET ?? '<SERVICE_NAME>_SECRET',
};
```

## Ajout dans la base de donnée

Pour ajouter un service dans la base de donnée, il faut dans un premier temps ajouter ses informations 
dans le fichier `back_end/src/prisma/services-data/services.data.ts` dans l'objet `services` :

```typescript
export const services = {
    // [...]
    <serviceName>: { name: '<Service Name>', slug: '<service-name>' },
};
```

Dans **ce même fichier**, il faut ajouter le service dans la liste `servicesData` :

```typescript
// [...]

const servicesData: Service[] = [

  // [...]

  {
    name:               services.<serviceName>.name,    // Nom du service
    slug:               services.<serviceName>.slug,    // Slug du service
    serviceColor:       '#1C1C1C',                      // Couleur du service 
                                                        //      (Le logo du service doit être visible avec cette couleur en fond)
    iconUrl:            '/assets/<serviceName>.png',    // Logo du service
    apiBaseUrl:         '<Base URL du service>',        // URL de l'API
    authType:           'oauth2',                       // Type d'authentification (oauth2 / api_key / basic)
    documentationUrl:   '<URL de la Documentation>',    // URL vers la documentation de l'API
    isActive:           true,                           // Si false, alors le service ne sera pas renvoyé dans les requêtes.
    triggers:           [],                             // Liste des triggers associées
    actions:            [],                             // Liste des actions associées
  },
];

// [...]
```

## Ajout de la route d'authentification

### Création des fichiers requis

Afin de créer une route d'authentification, il faudra utiliser le script `back_end/cli/add_service_auth_route.sh` de la manière suivante :
```bash
$ add_service_auth_route.sh service-name
```

> [!NOTE]
> Par exemple, pour ajouter un service 'discord', il faudra faire :
> ```bash
> $ add_service_auth_route.sh discord
> ```

Le script va générer 4 fichiers :
- `service-name.controller.ts`
- `service-name.guard.ts`
- `service-name.module.ts`
- `service-name.strategy.ts`

Parmi ces quatre fichiers, seuls les fichiers `service-name.guard.ts` et `service-name.strategy.ts` doivent être passés en revu :

### service-name.guard.ts

Dans la fonction `AREA_AuthGuard('<service-name>')`, le `'<service-name>'` doit correspondre au `'<service-name>'` 
de `passport.authenticate('<service-name>', { ... })` dans l'exemple d'utilisation du service disponible sur [passportjs](https://www.passportjs.org/), dans la partie **Authenticate Requests**.
<br>
Pour microsoft par exemple, vous pouvez trouver cette partie ici : [passportjs/microsoft](https://www.passportjs.org/packages/passport-microsoft/#authenticate-requests).

### service-name.strategy.ts

Dans la fonction `PassportStrategy(Strategy, '<service-name>')`, le `'<service-name>'` doit correspondre au `'<service-name>'`
de `passport.authenticate('<service-name>', { ... })` dans l'exemple d'utilisation du service disponible sur [passportjs](https://www.passportjs.org/).

De plus, dans ce même fichier, il se peut que le package d'import soit incorrect. Pour le savoir, **à la ligne 8** de ce fichier, vous trouverez cette ligne :
```typescript
// [...]
} from 'passport-<service-name>';               # EDIT THIS LINE IF AN ERROR OCCURS
// [...]
```

Le package d'import doit correspondre au `<service-name>'`
de `require('passport-<service-name>').Strategy` dans l'exemple d'utilisation du service disponible sur [passportjs](https://www.passportjs.org/), dans la partie **Configure Strategy**.
<br>
Pour microsoft par exemple, vous pouvez trouver cette partie ici : [passportjs/microsoft](https://www.passportjs.org/packages/passport-microsoft/#configure-strategy).

### Exposition de la route d'authentification

Une fois ces étapes faîtes, il ne vous suffit plus qu'à exposer la route d'authentification sur l'API.
Pour cela, il vous suffit d'éditer le fichier `back_end/src/app/oauth2/oauth2.module.ts` en ajoutant les imports suivants :
```typescript
// [...]
import { <ServiceName>OAuth2Module } from '@app/oauth2/services/<service-name>/<service-name>.module';
import { <ServiceName>Strategy } from '@app/oauth2/services/<service-name>/<service-name>.strategy';
// [...]
```

Ainsi qu'en important le module de votre service dans celui d'oauth2 ainsi qu'en lui donnant l'accès à votre stratégie :
```typescript
// [...]

@Module({
    imports: [<ServiceName>OAuth2Module, /* ... */],
    controllers: [/* ... */],
    providers: [
        <ServiceName>Strategy,
        /* ... */
    ],
})
export class Oauth2Module {}
```

Une fois cela fait, votre service est disponible !

> [!NOTE]
> N'oubliez pas de tester votre service avant de push ;)

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
