import { ApiProperty } from '@nestjs/swagger';

export class StepDTO {
  @ApiProperty({
    description: "Identifiant unique de l'étape",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Identifiant du zap auquel appartient cette étape',
    example: 1,
  })
  zap_id: number;

  @ApiProperty({
    description: 'Identifiant de la connexion utilisée pour cette étape',
    example: 5,
  })
  connection_id: number;

  @ApiProperty({
    description: "Type d'étape : TRIGGER (déclencheur) ou ACTION",
    enum: ['TRIGGER', 'ACTION'],
    example: 'TRIGGER',
  })
  step_type: 'TRIGGER' | 'ACTION';

  @ApiProperty({
    description: 'Identifiant du trigger si step_type est TRIGGER, null sinon',
    example: 1,
    nullable: true,
  })
  trigger_id: number | null;

  @ApiProperty({
    description: "Identifiant de l'action si step_type est ACTION, null sinon",
    example: null,
    nullable: true,
  })
  action_id: number | null;

  @ApiProperty({
    description:
      "Ordre d'exécution de l'étape (0 pour trigger, 1+ pour actions)",
    example: 0,
  })
  step_order: number;

  @ApiProperty({
    description: "Configuration de l'étape (fields du trigger ou de l'action)",
    example: {
      repository: 'owner/repo',
      branch: 'main',
    },
  })
  payload: object;

  @ApiProperty({
    description: "Date de création de l'étape",
    example: '2021-10-04T12:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: "Date de dernière mise à jour de l'étape",
    example: '2021-10-04T12:00:00.000Z',
  })
  updated_at: Date;
}
