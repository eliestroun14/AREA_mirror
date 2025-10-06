import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { AboutJsonService } from './aboutJson.service';
import { AboutJsonResponseDTO } from './aboutJson.dto';

@ApiTags('about.json')
@Controller('about.json')
export class AboutJsonController {
  constructor(private readonly aboutJsonService: AboutJsonService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtenir les informations sur les services disponibles',
    description:
      'Retourne la liste de tous les services disponibles avec leurs actions (triggers) et réactions, ainsi que des informations sur le client et le serveur.',
  })
  @ApiResponse({
    status: 200,
    description: 'Informations récupérées avec succès',
    type: AboutJsonResponseDTO,
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur',
  })
  async getAboutJson(@Req() req: Request): Promise<AboutJsonResponseDTO> {
    return this.aboutJsonService.getAboutJson(req);
  }
}
