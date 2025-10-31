import { ApiProperty } from '@nestjs/swagger';

export class ActivityDTO {
  @ApiProperty({ example: 'connection_created' })
  type: string;

  @ApiProperty({ example: 'New GitHub connection' })
  title: string;

  @ApiProperty({ example: 'Created connection to GitHub account foobar' })
  description?: string | null;

  @ApiProperty({ example: new Date().toUTCString() })
  created_at: string;

  @ApiProperty({ example: {} })
  meta?: Record<string, any> | null;
}

export class GetUserActivitiesResponse {
  @ApiProperty({ type: [ActivityDTO] })
  activities: ActivityDTO[];
}
