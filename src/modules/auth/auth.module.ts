import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from 'src/core/misc/consts';
import { WsAuthGuard } from './wsAuth.guard';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    UsersModule,
    OtpModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secure,
      signOptions: { expiresIn: '36000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService , WsAuthGuard],
  exports:[WsAuthGuard]
})
export class AuthModule {}
