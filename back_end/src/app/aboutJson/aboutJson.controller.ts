import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AboutJsonService } from './aboutJson.service';

@Controller('about.json')
export class AboutJsonController {
  constructor(private readonly aboutJsonService: AboutJsonService) {}

  @Get()
  async getAboutJson(@Req() req: Request) {
    return this.aboutJsonService.getAboutJson(req);
  }
}
