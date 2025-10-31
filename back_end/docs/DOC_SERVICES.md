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

### Ajout dans la base de donnée

Pour ajouter un service dans la base de donnée, il faut dans un premier temps ajouter ses informations 
dans le fichier [`back_end/src/config/utils.ts`](/back_end/src/config/utils.ts) dans la variable `constants` :

```typescript
export const constants = {
    // [...]
    services: {
        // [...]
        <serviceName>: { name: '<Service Name>', slug: '<service-name>' },
    },
};
```

Dans le fichier [`back_end/src/prisma/services-data/services.data.ts`](/back_end/src/prisma/services-data/services.data.ts), il faut ajouter le service dans la liste `servicesData` :

```typescript
// [...]
import { <serviceName>Data } from '@root/services/<service-name>/<service-name>.data';

const servicesData: Service[] = [
  // [...]
  <serviceName>Data,
];
```

### Ajout de la route d'authentification

#### Création des fichiers requis

Afin de créer une route d'authentification, il faudra utiliser le script `back_end/cli/create_service.sh` de la manière suivante :
```bash
$ create_service.sh service-name
```

> [!NOTE]
> Par exemple, pour ajouter un service 'discord', il faudra faire :
> ```bash
> $ create_service.sh discord
> ```

Le script va générer 4 fichiers dans le dossier `back_end/src/services/<service-name>` :
- `<service-name>.controller.ts`
- `<service-name>.guard.ts`
- `<service-name>.module.ts`
- `<service-name>.strategy.ts`

Parmi ces quatre fichiers, seuls les fichiers `<service-name>.guard.ts` et `<service-name>.strategy.ts` doivent être passés en revu :

#### <service-name>.guard.ts

Dans la fonction `AREA_AuthGuard('<service-name>')`, le `'<service-name>'` doit correspondre au `'<service-name>'` 
de `passport.authenticate('<service-name>', { ... })` dans l'exemple d'utilisation du service disponible sur [passportjs](https://www.passportjs.org/), dans la partie **Authenticate Requests**.
<br>
Pour microsoft par exemple, vous pouvez trouver cette partie ici : [passportjs/microsoft](https://www.passportjs.org/packages/passport-microsoft/#authenticate-requests).

#### <service-name>.strategy.ts

Dans la fonction `PassportStrategy(Strategy, '<service-name>')`, le `'<service-name>'` doit correspondre au `'<service-name>'`
de `passport.authenticate('<service-name>', { ... })` dans l'exemple d'utilisation du service disponible sur [passportjs](https://www.passportjs.org/).

De plus, dans ce même fichier, il se peut que le package d'import soit incorrect. Pour le savoir, **à la ligne 8** de ce fichier, vous trouverez cette ligne :
```typescript
// [...]
} from 'passport-<service-name>';               // EDIT THIS LINE IF AN ERROR OCCURS
// [...]
```

Le package d'import doit correspondre au `<service-name>'`
de `require('passport-<service-name>').Strategy` dans l'exemple d'utilisation du service disponible sur [passportjs](https://www.passportjs.org/), dans la partie **Configure Strategy**.
<br>
Pour microsoft par exemple, vous pouvez trouver cette partie ici : [passportjs/microsoft](https://www.passportjs.org/packages/passport-microsoft/#configure-strategy).

#### Exposition de la route d'authentification

Une fois ces étapes faîtes, il ne vous suffit plus qu'à exposer la route d'authentification sur l'API.
Pour cela, il vous suffit d'éditer le fichier `back_end/src/app/oauth2/oauth2.module.ts` en ajoutant les imports suivants :
```typescript
// [...]
import { <ServiceName>OAuth2Module } from '@app/oauth2/services/<service-name>/<service-name>.module';
import { <ServiceName>Strategy } from '@root/services/<service-name>/oauth2/<service-name>.strategy';
// [...]
```

Ainsi qu'en important le module de votre service dans celui d'oauth2 ainsi qu'en lui donnant l'accès à votre stratégie :
```typescript
// [...]

@Module({
    imports: [
        // [...]
        <ServiceName>OAuth2Module,
    ],
    // [...]
    providers: [
        // [...]
        <ServiceName>Strategy,
    ],
})
export class Oauth2Module {}
```

Une fois cela fait, votre service est disponible !

> [!NOTE]
> N'oubliez pas de tester votre service avant de push ;)

## Ajout d'un trigger

### Pré-requis

Pour ajouter un trigger, vous devez dans un premier temps avoir configuré l'oauth2 du service. Si vous ne l'avez pas encore fait, suivez [ces étapes](#avant-dajouter-un-service).

Pour ajouter un trigger, il faut déjà savoir si c'est un trigger par `polling` ou pas `webhook`.

__Trigger par polling :__ Un trigger par polling va faire des requêtes à interval régulier sur l'API du service
et comparer les données reçues avec les données en base de donnée. En cas de différence, les nouvelles données sont sauvegardé
dans la base de donnée, et le zap est lancé.

__Trigger par webhook :__ Un trigger par webhook va créer un 'hook' sur le service afin de lui permettre de nous prévenir
lorsqu'un changement a lieu. Pour cela, il faudra faire un appel API vers le service pour le tenir informé de l'url sur
lequel il doit envoyer les données lors d'un changement.

Si votre trigger est de type `polling`, suivez [ces étapes](#trigger-de-type-polling).
<br>
Si votre trigger est de type `webhook`, suivez [ces étapes](#trigger-de-type-webhook).

### Définitions

Avant de créer un trigger, il faut comprendre certaines notions.

#### Les fichiers <service-name>-<trigger-name>.data.ts

Ces fichiers décrivent un trigger. Ils contiennent :
- Le titre du trigger
- La description du trigger
- Les champs d'un trigger (disponible sur le front-end)
- Les variables moustaches d'un trigger (utilisables par les actions)

> [!NOTE]
> Dans le code, les données remplies par l'utilisateur dans les champs d'une étape (trigger / action) sont appelées `payload`.

> [!NOTE]
> Les variables moustaches sont les variables de ce format : `{{MaVariable}}`.
> L'utilisateur peut les utiliser dans les champs d'une action afin de personnaliser son action en fonction du résultat d'un trigger ou d'une action précédente.
> <br>
> Les variables moustaches sont définis à chaque fin d'étape (trigger / action). 

__Exemple :__
```typescript
import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const githubOnNewRepositoryData: ServiceTrigger = {
  class_name: 'GithubOnNewRepositoryPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New repository',
  description: 'Run the zap when a new repository is created.',
  require_connection: true,
  polling_interval: 1000,
  fields: {
    owner: {
      key: 'owner',                         // Nom de la variable dans laquelle sera stocké ce que l'utilisateur a écrit
      field_name: "Nom d'utilisateur",      // Nom du champs affiché dans le front-end
      required: true,
      type: 'string',
      default_value: 'nl1x',
      placeholder: 'nl1x',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
  },
  variables: [
    { name: 'RepositoryName' },             // Variable utilisable dans les champs d'une action
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
```

### Trigger de type webhook

#### Génération des fichiers

Pour créer un trigger de type `webhook`, vous devez dans un premier temps générer les fichiers
requis à l'aide du script [`add_service_trigger.sh`](/back_end/cli/add_service_trigger.sh) disponible dans le dossier [`cli`](/back_end/cli) :
```bash
$ add_service_trigger.sh webhook service-name trigger-name 'Trigger title' 'Trigger description'
```

Lors de l'exécution de la commande, les fichiers nécéssaires à la création de votre trigger seront générés automatiquement.

> [!TIP]
> Ce script est exécutable dans n'importe quel dossier du projet.

Le script va générer 4 fichiers :
- `<service-name>-<trigger-name>.controller.ts`: Contient la route sur laquelle les données du webhook seront reçu.
- `<service-name>-<trigger-name>.data.ts`: Contient les informations générales du trigger.
- `<service-name>-<trigger-name>.webhook.ts`: Contient la classe permettant de lier le service avec le zap. 

> [!NOTE]
> La classe de webhook du trigger permet d'indiquer au service sur quelle route envoyer les données lorsque le trigger est déclenché.

- `<service-name>-<trigger-name>.dto.ts`: Contient les typages du trigger.

> [!NOTE]
> Les typages du trigger sont principalement utilisés dans la classe de webhook du trigger ainsi que dans la classe du contrôleur du webhook.

#### Enregistrement du contrôleur

Une fois les fichiers générés, il faut enregistrer le contrôleur du trigger. 
Pour cela, ajouter votre contrôleur dans le fichier [`webhooks.module.ts`](/back_end/src/app/webhooks/webhooks.module.ts) comme ci-dessous :
```typescript
// [...]
// Import du contrôleur dans le fichier
import { <ServiceName><TriggerName>WebhookController } from '@root/services/<service-name>/triggers/<trigger-name>/<service-name>-<trigger-name>.controller';

@Module({
    controllers: [
        <ServiceName><TriggerName>WebhookController
    ],
    // [...]
})
export class WebhooksModule {}
```

#### Enregistrement des données générales

Il faut également enregistrer les données générales du trigger.
Pour cela, vous devez éditer le fichier `/back_end/src/services/<service-name>/<service-name>.data.ts` de la manière suivante :
```typescript
// [...]
import { <serviceName><TriggerName>Data } from '@root/services/<service-name>/triggers/<trigger-name>/<service-name>-<trigger-name>.data';

export const <serviceName>Data: Service = {
    // [...]
    triggers: [
      // [...]
      <serviceName><TriggerName>Data, // Ajoutez les données générales de votre trigger ici
    ],
    // [...]
};
```

Une fois cela fait, votre trigger est correctement enregistré sur l'AREA, mais il n'est pas encore terminé.
Il manque l'implémentation de la logique.

#### Implémentation de la logique

##### Typage

Dans le fichier `<service-name>-<trigger-name>.dto.ts`, vous avez 2 types :
```typescript
export type <ServiceName><TriggerName>TriggerPayload = {
  // Ajoutez les types de vos champs ici
};

export type <ServiceName><TriggerName>Body = {
  // Ajoutez les types du body reçu lors du déclenchement du webhook
};
export type <ServiceName><TriggerName>Headers = {
  // Ajoutez les types des headers reçus lors du déclenchement du webhook
};
export type <ServiceName><TriggerName>Queries = { 
  // Ajoutez les types des queries reçues lors du déclenchement du webhook
};
```

- `<ServiceName><TriggerName>TriggerPayload`
Le type `<ServiceName><TriggerName>TriggerPayload` correspond simplement au payload de votre trigger.
Par exemple, si dans vos fields vous avez :
```typescript
fields: {
  repository: {
    // [...]
    key: 'repository',              // Nom de la variable dans laquelle sera enregistré les données entrées par l'utilisateur
    field_name: 'Nom du dépôt github',
    type: 'string',                 // Type de la donnée
    // [...]
  },
}
```
Alors dans votre payload vous aurez :
```typescript
export type <ServiceName><TriggerName>TriggerPayload = {
    // Nom de la variable dans laquelle sera enregistré les données entrées par l'utilisateur
    // \/\/\/\/
    repository: string;
    //          /\/\/\
    //          Type de la donnée
}
```

- `<ServiceName><TriggerName>Body` & `<ServiceName><TriggerName>Headers` & `<ServiceName><TriggerName>Queries`
Lorsque le service va faire un appel API vers l'API de l'AREA, les données du trigger seront présentes
dans le body de la requête, les headers ou encore les queries. Ces types dépendent entièrement de la
requête que le service fera. Vous trouverez dans la documentation de ce dernier la manière dont il répartie
les différentes données.

Par exemple, si votre trigger a une variable `RepositoryName` d'enregistré dans ses données (dans le fichier `service-name-<trigger-name>.data.ts`),
c'est dans ces types que vous allez récupérer la valeur de cette variable. Imaginons que lorsque vous recevez votre requête,
on vous dit dans la documentation que le nom du repository se trouve dans `repository.name` dans le body de la requête. Dans ce cas,
vous allez définir le type du body sur :
```typescript
export type <ServiceName><TriggerName>Body = {
  repository: { 
    name: string;
  }
};
```

##### Données générales

Pour comprendre l'utilité du fichier `<service-name>-<trigger-name>.data.ts`, lisez [cette partie de la documentation](#les-fichiers-service-name-trigger-namedatats).

##### Classe Webhook

Dans le fichier `<service-name>-<trigger-name>.webhook.ts`, vous avez une classe de type WebhookTrigger :
```typescript
// [...]

export class <ServiceName><TriggerName>WebhookTrigger extends WebhookTrigger {
    static override async hook(
        webhookUrl: string,
        secret: string,
        payload: <ServiceName><TriggerName>TriggerPayload,
        accessToken: string,
    ): Promise<boolean> {
        return false;
    }
}
```

C'est dans la méthode `hook` que vous allez effectuer vos appels API afin de lier le service au zap de l'utilisateur.

Dans cette méthode, vous avez différents paramètres :
- `webhookUrl` : URL du webhook sur laquelle le service doit faire une requête pour envoyer les données.
- `secret` : Secret du hook (Si le service ne demande pas de secret, alors n'utilisez pas ce paramètre).
- `payload` : Payload de l'utilisateur.
- `accessToken` : Jeton d'accès de l'API du service.

La valeur de retour est soit :
- `false` : Dans le cas où la création du hook a échoué.
- `true` : Dans le cas où la création du hook a réussi.

Pour savoir si la création du hook a réussi ou échoué, référez-vous à la documentation du service.

##### Classe Controller

Dans le fichier `<service-name>-<trigger-name>.controller.ts`, vous avez une classe de type `AREA_WebhookController` :
```typescript
// [...]

@WebhookController('<service-name>/<trigger-name>')
export class <ServiceName><TriggerName>WebhookController extends AREA_WebhookController {
  constructor(
    workflowService: RunnerService,
    zapRunnerService: ZapsRunnerService,
  ) {
    super(workflowService, zapRunnerService);
  }

  protected getVariablesData(
    headers: <ServiceName><TriggerName>Headers,
    body: <ServiceName><TriggerName>Body,
    queries: <ServiceName><TriggerName>Queries,
  ): RunnerVariableData[] {
    return [];
  }
}
```

La méthode `getVariablesData` a pour but de retourner les valeurs des variables moustaches de votre trigger.

Cette méthode contient plusieurs paramètres :
- `headers`: Les headers de la requête du webhook.
- `body`: Le body de la requête du webhook.
- `queries`: Les queries de la requête du webhook.

Pour plus d'information sur ces paramètres, lisez la partie du fichier [`<service-name>-<trigger-name>.dto.ts`](#typage)

##### Tests

Une fois que toutes ces étapes sont faîtes, vous pouvez tester votre trigger depuis la page du front-end.

### Trigger de type polling

#### Génération des fichiers

Pour créer un trigger de type `polling`, vous devez dans un premier temps générer les fichiers
requis à l'aide du script [`add_service_trigger.sh`](/back_end/cli/add_service_trigger.sh) disponible dans le dossier [`cli`](/back_end/cli).
```bash
$ add_service_trigger.sh poll service-name trigger-name 'Trigger title' 'Trigger description'
```

Lors de l'exécution de la commande, les fichiers nécéssaires à la création de votre trigger seront générés automatiquement.

> [!TIP]
> Ce script est exécutable dans n'importe quel dossier du projet.

Le script va générer 3 fichiers :
- `<service-name>-<trigger-name>.data.ts`: Contient les informations générales du trigger.
- `<service-name>-<trigger-name>.poll.ts`: Contient la classe de polling du trigger.

> [!NOTE]
> La classe de polling du trigger permet de faire une requête API vers le service afin de mettre à jour les données et
> de vérifier si le trigger s'est déclenché ou non.

- `<service-name>-<trigger-name>.dto.ts`: Contient les typages du trigger.

> [!NOTE]
> Les typages du trigger sont principalement utilisés dans la classe de polling du trigger.

#### Enregistrement de la classe

Une fois les fichiers générés, il faut enregistrer la classe de polling du trigger.
Pour cela, ajouter votre trigger dans le fichier [`triggers.runner.factory.ts`](/back_end/src/runner/zaps/triggers/triggers.runner.factory.ts) comme ci-dessous :
```typescript
// [...]
export class TriggersRunnerFactory {
    private registers: Record<string, TriggerBuilderFunction> = {
        // [...]
        <ServiceName><TriggerName>Poll: (builder: PollTriggerBuilderParams) => {
            return new <ServiceName><TriggerName>Poll(builder);
        },
    };

    // [...]
}
```

#### Enregistrement des données générales

Il faut également enregistrer les données générales du trigger.
Pour cela, vous devez éditer le fichier `/back_end/src/services/<service-name>/<service-name>.data.ts` de la manière suivante :
```typescript
// [...]
import { <serviceName><TriggerName>Data } from '@root/services/<service-name>/triggers/<trigger-name>/<service-name>-<trigger-name>.data';

export const <serviceName>Data: Service = {
    // [...]
    triggers: [
      // [...]
      <serviceName><TriggerName>Data, // Ajoutez les données générales de votre trigger ici
    ],
    // [...]
};
```

Une fois cela fait, votre trigger est correctement enregistré sur l'AREA, mais il n'est pas encore terminé.
Il manque l'implémentation de la logique.

#### Implémentation de la logique

##### Typage

Dans le fichier `<service-name>-<trigger-name>.dto.ts`, vous avez 2 types :
```typescript
export interface <ServiceName><TriggerName>PollPayload {
    // Ajoutez les types de vos champs ici
}

export interface <ServiceName><TriggerName>PollComparisonData {
    // Ajoutez les types de vos données stockées ici
}
```

- `<ServiceName><TriggerName>PollPayload`
  Le type `<ServiceName><TriggerName>PollPayload` correspond simplement au payload de votre trigger.
  Par exemple, si dans vos fields vous avez :
```typescript
fields: {
  repository: {
    // [...]
    key: 'repository',              // Nom de la variable dans laquelle sera enregistré les données entrées par l'utilisateur
    field_name: 'Nom du dépôt github',
    type: 'string',                 // Type de la donnée
    // [...]
  },
}
```
Alors dans votre payload vous aurez :
```typescript
export interface <ServiceName><TriggerName>PollPayload {
    // Nom de la variable dans laquelle sera enregistré les données entrées par l'utilisateur
    // \/\/\/\/
    repository: string;
    //          /\/\/\
    //          Type de la donnée
}
```

- `<ServiceName><TriggerName>PollComparisonData`
  Le type `<ServiceName><TriggerName>PollComparisonData` correspond aux données que vous allez garder en mémoire afin de détecter
  un changement entre la base de donnée du service et la base de donnée de l'AREA.
  Par exemple, si l'objectif de votre trigger est de détecter l'ajout d'un nouveau repository, vous allez sans-doute vouloir
  sauvegarder les noms des repositories déjà existants. Dans ce cas, dans votre type `ComparisonData`, vous aurez :
```typescript
export interface <ServiceName><TriggerName>PollComparisonData {
  repositoriesName: string[];
}
```

Cela vous permettra de sauvegarder plus tard tous les noms des repositories github déjà existants, et ainsi de
comparer cette liste avec celle que vous obtiendrez lorsque vous ferez votre appel API vers le service pour récupérer
les repositories de l'API du service.

##### Données générales

Pour comprendre l'utilité du fichier `<service-name>-<trigger-name>.data.ts`, lisez [cette partie de la documentation](#les-fichiers-service-name-trigger-namedatats).

##### Classe Poll

Dans le fichier `<service-name>-<trigger-name>.poll.ts`, vous avez une classe de type PollTrigger :
```typescript
// [...]

export class <ServiceName><TriggerName>Poll extends PollTrigger<
  <ServiceName><TriggerName>PollPayload,
  <ServiceName><TriggerName>PollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<<ServiceName><TriggerName>PollComparisonData>
  > {
    return {
      status: RunnerExecutionStatus.SUCCESS,
      variables: [],
      comparison_data: {},
      is_triggered: false,
    };
  }
}
```

C'est dans la méthode `_check` que vous allez effectuer vos appels API pour détecter un changement entre la base de donnée du service
et la base de donnée de l'AREA.

Dans cette classe, vous avez accès aux attributs suivants de la classe :
- `this.lastComparisonData` : Données actuelles de la base de donnée de l'AREA.
- `this.accessToken` : Jeton d'accès de l'API du service.
- `this.lastExecution` : Timestamp de la dernière exécution **du zap**.
- `this.payload` : Payload de l'utilisateur.

La valeur de retour contient plusieurs informations :
- `status` : **Si une erreur s'est produite**, définissez cette valeur sur `RunnerExecutionStatus.FAILURE`.
- `variables` : Liste des variables de votre trigger. Remplissez-le en fonction des variables que vous avez défini dans le fichier `service-name-trigger-name.data.ts`.
- `comparison_data` : Données à sauvegarder dans la base de donnée de l'AREA.
- `is_triggered` : `true` si les actions du zap doivent être exécutées, `false` sinon.

##### Tests

Une fois que toutes ces étapes sont faîtes, vous pouvez tester votre trigger depuis la page du front-end.

## Ajout d'une action

### Pré-requis

Pour ajouter une action, vous devez dans un premier temps avoir configuré l'oauth2 du service. Si vous ne l'avez pas encore fait, suivez [ces étapes](#avant-dajouter-un-service).

### Définitions

Avant de créer une action, il faut comprendre certaines notions.

#### Les fichiers <service-name>-<action-name>.data.ts

Ces fichiers décrivent une action. Ils contiennent :
- Le titre de l'action
- La description de l'action
- Les champs d'une action (disponible sur le front-end)
- Les variables moustaches d'une action (utilisables par d'autres actions)

> [!NOTE]
> Dans le code, les données remplies par l'utilisateur dans les champs d'une étape (trigger / action) sont appelées `payload`.

> [!NOTE]
> Les variables moustaches sont les variables de ce format : `{{MaVariable}}`.
> L'utilisateur peut les utiliser dans les champs d'une action afin de personnaliser son action en fonction du résultat d'un trigger ou d'une action précédente.
> <br>
> Les variables moustaches sont définis à chaque fin d'étape (trigger / action).

__Exemple :__
```typescript
import { ServiceAction } from '@root/prisma/services-data/services.dto';

export const discordSendMessageData: ServiceAction = {
  class_name: 'DiscordSendMessageExecutor',
  http_requests: {
    method: 'POST',
    endpoint: '',
    description:
      "Envoie un message sur un channel discord avec les webhooks.",
  },
  name: 'Envoyer un message avec les webhooks',
  description: 'Envoie un message sur un channel discord avec les webhooks.',
  require_connection: true,
  fields: {
    message: {
      key: 'message',                                   // Nom de la variable dans laquelle sera stocké ce que l'utilisateur a écrit
      field_name: "Message",                            // Nom du champs affiché dans le front-end
      required: true,
      type: 'string',
      default_value: 'Hello from AREA!',
      placeholder: 'Type your message here...',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
  },
  variables: [
    { name: 'Message' },                                // Variable utilisable dans les champs d'une action
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
```

### Ajout de l'action

#### Génération des fichiers

Pour créer une action, vous devez dans un premier temps générer les fichiers
requis à l'aide du script [`add_service_action.sh`](/back_end/cli/add_service_action.sh) disponible dans le dossier [`cli`](/back_end/cli) :
```bash
$ add_service_action.sh service-name <action-name> 'Action title' 'Action description'
```

Lors de l'exécution de la commande, les fichiers nécéssaires à la création de votre action seront générés automatiquement.

> [!TIP]
> Ce script est exécutable dans n'importe quel dossier du projet.

Le script va générer 3 fichiers :
- `<service-name>-<action-name>.data.ts`: Contient les informations générales due l'action.
- `<service-name>-<action-name>.executor.ts`: Contient la classe permettant d'exécuter la requête API de l'action.
- `<service-name>-<action-name>.dto.ts`: Contient les typages de l'action.

> [!NOTE]
> Les typages de l'action sont principalement utilisés dans la classe d'exécution de l'action.

#### Enregistrement de l'exécuteur

Une fois les fichiers générés, il faut enregistrer l'exécuteur de l'action.
Pour cela, ajouter votre exécuteur dans le fichier [`actions.runner.factory.ts`](/back_end/src/runner/zaps/actions/actions.runner.factory.ts) comme ci-dessous :
```typescript
// [...]
export class ActionsRunnerFactory {
  private registers: Record<string, ActionBuilderFunction> = {
    <ServiceName><ActionName>ActionExecutor: (builder: ActionBuilderParams) => {
      return new <ServiceName><ActionName>ActionExecutor(builder);
    },
  };

  // [...]
}
```

#### Enregistrement des données générales

Il faut également enregistrer les données générales de l'action.
Pour cela, vous devez éditer le fichier `/back_end/src/services/<service-name>/<service-name>.data.ts` de la manière suivante :
```typescript
// [...]
import { <serviceName><ActionName>Data } from '@root/services/<service-name>/actions/<trigger-name>/<service-name>-<trigger-name>.data';

export const <serviceName>Data: Service = {
  // [...]
  actions: [
    // [...]
    <serviceName><ActionName>Data, // Ajoutez les données générales de votre action ici
  ],
  // [...]
};
```

Une fois cela fait, votre action est correctement enregistrée sur l'AREA, mais elle n'est pas encore terminée.
Il manque l'implémentation de la logique.

#### Implémentation de la logique

##### Typage

Dans le fichier `<service-name>-<action-name>.dto.ts`, vous avez 1 type :
```typescript
export interface <ServiceName><ActionName>ExecutorPayload {
  // Ajoutez les types de vos champs ici
}
```

- `<ServiceName><ActionName>ExecutorPayload`
Le type `<ServiceName><ActionName>ExecutorPayload` correspond simplement au payload de votre action.
Par exemple, si dans vos fields, vous avez :
```typescript
fields: {
  message: {
    // [...]
    key: 'message',                 // Nom de la variable dans laquelle sera enregistré les données entrées par l'utilisateur
    field_name: 'Message',
    type: 'string',                 // Type de la donnée
    // [...]
  },
}
```
Alors dans votre payload vous aurez :
```typescript
export type <ServiceName><ActionName>ExecutorPayload = {
  // Nom de la variable dans laquelle sera enregistré les données entrées par l'utilisateur
  // \/\/
  message: string;
  //       /\/\/\
  //       Type de la donnée
}
```

##### Données générales

Pour comprendre l'utilité du fichier `service-name-<action-name>.data.ts`, lisez [cette partie de la documentation](#les-fichiers-service-name-action-namedatats).

##### Classe Executor

Dans le fichier `<service-name>-<action-name>.executor.ts`, vous avez une classe de type ActionExecuton :
```typescript
// [...]

export default class <ServiceName><ActionName>Executor extends ActionExecutor<<ServiceName><ActionName>ActionPayload> {
  protected async _execute(
    payload: <ServiceName><ActionName>ActionPayload,
  ): Promise<ActionRunResult> {
    return {
      variables: [],
      status: RunnerExecutionStatus.FAILURE,
    };
  }
}
```

C'est dans la méthode `_execute` que vous allez effectuer vos appels API pour exécuter votre action.

Dans cette classe, vous avez accès à l'attribut suivant de la classe :
- `this.accessToken` : Jeton d'accès de l'API du service.

La valeur de retour contient plusieurs informations :
- `status` : **Si une erreur s'est produite**, définissez cette valeur sur `RunnerExecutionStatus.FAILURE`. 
Dans le cas contraire, définissez cette valeur sur `RunnerExecutionStatus.SUCCESS`.
- `variables` : Liste des variables de votre action. Remplissez-le en fonction des variables que vous avez définies dans le fichier `<service-name>-<action-name>.data.ts`.

##### Tests

Une fois que toutes ces étapes sont faîtes, vous pouvez tester votre action depuis la page du front-end.
