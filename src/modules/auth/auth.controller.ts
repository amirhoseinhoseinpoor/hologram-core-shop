import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TransactionInterceptor } from 'src/core/db/transaction.interceptor';
import { SignInDto } from './dto/signIn.dto';
import { Public } from 'src/core/decorator/public.decorator';
import { BadRequestException } from '@nestjs/common';
import { Provider } from 'src/core/decorator/provider.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseInterceptors(TransactionInterceptor)
  @Post('register')
  async signUp(@Body() dto: CreateUserDto) {
    return await this.authService.signUp(dto, 1, [3]); // domain=1, role=3
  }

  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(
      signInDto.username,
      signInDto.password,
      signInDto.captchaResponse,
      false
    );
  }

  @Public()
  @Post('adminLogin')
  async adminSignIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(
      signInDto.username,
      signInDto.password,
      signInDto.captchaResponse,
      true,
    );
  }

  @Provider()
  @UseInterceptors(TransactionInterceptor)
  @Post('createUserByAdmin')
  async createUserByAdmin(@Body() dto: CreateUserDto) {
    if (!dto.domain) {
      throw new BadRequestException('Domain and roleIds are required for admin user creation.');
    }
    return await this.authService.signUp(dto, dto.domain, dto.roleIds); 
  }
}
