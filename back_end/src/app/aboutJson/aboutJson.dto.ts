import { ApiProperty } from '@nestjs/swagger';

export class AboutJsonActionReactionDTO {
  @ApiProperty({
    description: "Nom de l'action ou de la réaction",
    example: 'on_push',
  })
  name: string;

  @ApiProperty({
    description: "Description détaillée de l'action ou de la réaction",
    example: "Déclenché lorsqu'un push est effectué sur le repository",
  })
  description: string;
}

export class AboutJsonServiceDTO {
  @ApiProperty({
    description: 'Nom du service',
    example: 'github',
  })
  name: string;

  @ApiProperty({
    description: 'Liste des actions (triggers) disponibles pour ce service',
    type: [AboutJsonActionReactionDTO],
    isArray: true,
  })
  actions: AboutJsonActionReactionDTO[];

  @ApiProperty({
    description: 'Liste des réactions disponibles pour ce service',
    type: [AboutJsonActionReactionDTO],
    isArray: true,
  })
  reactions: AboutJsonActionReactionDTO[];
}

export class AboutJsonClientDTO {
  @ApiProperty({
    description: 'Adresse IP du client',
    example: '127.0.0.1',
  })
  host: string;
}

export class AboutJsonServerDTO {
  @ApiProperty({
    description: 'Timestamp Unix actuel (en secondes)',
    example: 1633024800,
  })
  current_time: number;

  @ApiProperty({
    description:
      'Liste de tous les services disponibles avec leurs actions et réactions',
    type: [AboutJsonServiceDTO],
    isArray: true,
  })
  services: AboutJsonServiceDTO[];
}

export class AboutJsonResponseDTO {
  @ApiProperty({
    description: 'Informations sur le client',
    type: AboutJsonClientDTO,
    example: {
      host: '127.0.0.1',
    },
  })
  client: AboutJsonClientDTO;

  @ApiProperty({
    description: 'Informations sur le serveur',
    type: AboutJsonServerDTO,
    example: {
      current_time: 1633024800,
      services: [
        {
          name: 'github',
          actions: [
            {
              name: 'on_push',
              description:
                "Déclenché lorsqu'un push est effectué sur le repository",
            },
            {
              name: 'on_issue_opened',
              description: "Déclenché lorsqu'une issue est créée",
            },
          ],
          reactions: [
            {
              name: 'create_issue',
              description: 'Crée une nouvelle issue sur le repository',
            },
            {
              name: 'add_comment',
              description: 'Ajoute un commentaire sur une issue ou PR',
            },
          ],
        },
        {
          name: 'discord',
          actions: [
            {
              name: 'on_message',
              description: "Déclenché lorsqu'un message est envoyé",
            },
          ],
          reactions: [
            {
              name: 'send_message',
              description: 'Envoie un message sur un canal Discord',
            },
          ],
        },
      ],
    },
  })
  server: AboutJsonServerDTO;
}
