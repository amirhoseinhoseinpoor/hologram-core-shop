import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TransactionInterceptor } from 'src/core/db/transaction.interceptor';
import { SignInDto } from './dto/signIn.dto';
import { Public } from 'src/core/decorator/public.decorator';
import { BadRequestException } from '@nestjs/common';
import { Provider } from 'src/core/decorator/provider.decorator';
import { SendOtpDto } from './dto/sendOtp.dto';
import { SignInOtpDto } from './dto/signInOtp.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseInterceptors(TransactionInterceptor)
  @Post('register')
  async signUp(@Body() dto: RegisterDto) {
    return await this.authService.signUpWithOtp(dto);
  }
  // @Post('register')
  // async signUp(@Body() dto: CreateUserDto) {
  //   return await this.authService.signUp(dto, 1, [3]); // domain=1, role=3
  // }

  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(
      signInDto.username,
      signInDto.password,
      signInDto.captchaResponse,
      false,
    );
  }

  @Public()
  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.username, dto.type);
  }

  @Public()
  @Post('login-otp')
  signInOtp(@Body() dto: SignInOtpDto) {
    return this.authService.signInOtp(dto.username, dto.otp);
  }

  @Public()
  @Post('adminLogin')
  async adminSignIn(@Body() signInDto: SignInDto) {
    return this.authService.adminSignIn(
      signInDto.username,
      signInDto.password,
      signInDto.captchaResponse,
    );
  }

  @Public()
  @Post('adminLogin-otp')
  signInAdminOtp(@Body() dto: SignInOtpDto) {
    return this.authService.signInOtp(dto.username, dto.otp, true);
  }

  @Provider()
  @UseInterceptors(TransactionInterceptor)
  @Post('createUserByAdmin')
  async createUserByAdmin(@Body() dto: CreateUserDto) {
    if (!dto.domain) {
      throw new BadRequestException(
        'Domain and roleIds are required for admin user creation.',
      );
    }
    return await this.authService.signUp(dto, dto.domain, dto.roleIds);
  }
}
