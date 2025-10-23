import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CryptoService } from './crypto/crypto.service';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('oauth2')
@Controller('oauth2')
export class OAuth2TokenController {
  constructor(private cryptoService: CryptoService) {}

  @Post('encrypt-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Chiffre le JWT pour OAuth2',
    description:
      "Chiffre le JWT de l'utilisateur pour l'utiliser dans l'URL OAuth2",
  })
  @ApiResponse({
    status: 201,
    description: 'Token chiffré généré',
    schema: {
      type: 'object',
      properties: {
        encryptedToken: { type: 'string' },
        expiresIn: { type: 'number' },
      },
    },
  })
  encryptToken(@Req() req: Request, @Body() body: { platform?: string }) {
    const authHeader = req.headers.authorization;
    console.log('[encryptToken] Authorization header:', authHeader);
    const jwt = authHeader?.replace('Bearer ', '');
    console.log('[encryptToken] Extracted JWT:', jwt);

    if (!jwt) {
      console.error('[encryptToken] JWT token required but not found');
      throw new Error('JWT token required');
    }

    try {
      const encryptedToken = this.cryptoService.encryptJWT(jwt, body.platform);
      console.log('[encryptToken] Encrypted token generated successfully');
      return {
        encryptedToken,
        expiresIn: 300, // 5 minutes
      };
    } catch (err) {
      console.error('[encryptToken] Failed to encrypt token:', err);
      throw err;
    }
  }
}
