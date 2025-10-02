import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { Request } from 'express';
import { TriggersService } from './triggers.service';
import { AddZapTriggerStepDTO } from './triggers.dto';

@Controller('zaps')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':zapId/trigger')
  async createZapTriggerStep(
    @Param('zapId') zapId: string,
    @Body() body: Omit<AddZapTriggerStepDTO, 'zap_id'>,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number } | undefined;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    const userId = user.userId;
    const zap = await this.triggersService.getZapById(Number(zapId));
    if (!zap || zap.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this zap');
    }
    const dto: AddZapTriggerStepDTO = {
      ...body,
      zap_id: Number(zapId),
    };
    return await this.triggersService.createZapTriggerStep(dto);
  }
}
