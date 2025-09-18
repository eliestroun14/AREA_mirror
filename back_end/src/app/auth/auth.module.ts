import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@app/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { secretConstants } from '@app/auth/constants';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: secretConstants.jwt,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
