import { ApiProperty } from '@nestjs/swagger';

// ==================
//        DTOs
// ==================

/**
 * DTO de base pour une connexion (usage interne)
 */
export interface ConnectionDTO {
  id: number;
  user_id: number;
  service_id: number;
  access_token: string;
  refresh_token: string | null;
  expires_at: Date | null;
}

/**
 * DTO de réponse pour une connexion utilisateur
 */
export class ConnectionResponseDTO {
  @ApiProperty({
    description: 'Identifiant unique de la connexion',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Identifiant du service connecté',
    example: 1,
  })
  service_id: number;

  @ApiProperty({
    description: 'Nom du service',
    example: 'github',
  })
  service_name: string;

  @ApiProperty({
    description: 'Couleur du service (hex)',
    example: '#181717',
    nullable: true,
  })
  service_color: string | null;

  @ApiProperty({
    description: "URL de l'icône du service",
    example: '/assets/github.png',
    nullable: true,
  })
  icon_url: string | null;

  @ApiProperty({
    description: 'Nom de la connexion',
    example: 'Mon compte GitHub',
    nullable: true,
  })
  connection_name: string | null;

  @ApiProperty({
    description: 'Identifiant du compte (email, username, etc.)',
    example: 'user@github.com',
    nullable: true,
  })
  account_identifier: string | null;

  @ApiProperty({
    description: 'Indique si la connexion est active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Date de création de la connexion (format UTC)',
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
  })
  created_at: string;

  @ApiProperty({
    description: 'Date de dernière utilisation (format UTC)',
    example: 'Mon, 04 Oct 2021 12:00:00 GMT',
    nullable: true,
  })
  last_used_at: string | null;
}

/**
 * Réponse contenant toutes les connexions d'un utilisateur
 */
export class GetAllConnectionsResponse {
  @ApiProperty({
    description: "Liste de toutes les connexions de l'utilisateur",
    type: [ConnectionResponseDTO],
    isArray: true,
    example: [
      {
        id: 1,
        service_id: 1,
        service_name: 'github',
        service_color: '#181717',
        icon_url: '/assets/github.png',
        connection_name: 'Mon compte GitHub Pro',
        account_identifier: 'octocat@github.com',
        is_active: true,
        created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        last_used_at: 'Wed, 06 Oct 2021 15:30:00 GMT',
      },
      {
        id: 2,
        service_id: 2,
        service_name: 'discord',
        service_color: '#5865F2',
        icon_url: '/assets/discord.png',
        connection_name: 'Mon Discord Personnel',
        account_identifier: 'User#1234',
        is_active: true,
        created_at: 'Tue, 05 Oct 2021 09:15:00 GMT',
        last_used_at: 'Wed, 06 Oct 2021 14:20:00 GMT',
      },
      {
        id: 3,
        service_id: 3,
        service_name: 'gmail',
        service_color: '#EA4335',
        icon_url: '/assets/gmail.png',
        connection_name: 'Email professionnel',
        account_identifier: 'john.doe@gmail.com',
        is_active: false,
        created_at: 'Mon, 04 Oct 2021 16:45:00 GMT',
        last_used_at: null,
      },
    ],
  })
  connections: ConnectionResponseDTO[];
}

/**
 * Réponse contenant les connexions d'un utilisateur pour un service spécifique
 */
export class GetConnectionsByServiceResponse {
  @ApiProperty({
    description: 'Liste des connexions pour le service spécifié',
    type: [ConnectionResponseDTO],
    isArray: true,
    example: [
      {
        id: 1,
        service_id: 1,
        service_name: 'github',
        service_color: '#181717',
        icon_url: '/assets/github.png',
        connection_name: 'Mon compte GitHub Pro',
        account_identifier: 'octocat@github.com',
        is_active: true,
        created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
        last_used_at: 'Wed, 06 Oct 2021 15:30:00 GMT',
      },
      {
        id: 4,
        service_id: 1,
        service_name: 'github',
        service_color: '#181717',
        icon_url: '/assets/github.png',
        connection_name: 'GitHub Personnel',
        account_identifier: 'myuser@users.noreply.github.com',
        is_active: true,
        created_at: 'Wed, 06 Oct 2021 10:00:00 GMT',
        last_used_at: 'Wed, 06 Oct 2021 16:00:00 GMT',
      },
    ],
  })
  connections: ConnectionResponseDTO[];
}
