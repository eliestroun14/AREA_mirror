import { Module } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';
import { ConnectionModule } from './connection/connection.module';
import {ConnectionService} from "@app/connection/connection.service";
import {PrismaService} from "@root/prisma/prisma.service";

@Module({
  imports: [AuthModule, ConnectionModule],
})
export class AppModule {}
