import { Module } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [AuthModule, UserModule],
})
export class AppModule {}
