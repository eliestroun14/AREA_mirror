import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { google } from 'googleapis';
import { envConstants } from '@app/auth/constants';

@Injectable()
export class GoogleService {
  constructor(private prismaService: PrismaService) {}

  async sendEmail(
    subject: string,
    to: string,
    content: string,
    access_token: string,
  ): Promise<boolean> {
    const oAuth2Client = new google.auth.OAuth2(
      envConstants.google_client_id,
      envConstants.google_client_secret,
      'http://127.0.0.1:3000/connection/google',
    );

    oAuth2Client.setCredentials({
      access_token: access_token,
    });
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=UTF-8',
      '',
      content,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return res.ok;
  }
}
