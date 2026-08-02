import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from '../otp/otp.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  private failedLoginAttempts: { [key: string]: number } = {};

  // private otpStore: {
  //   [username: string]: {
  //     code: string;
  //     expiresAt: number;
  //   };
  // } = {};

  // private otpCooldown: {
  //   [username: string]: number;
  // } = {};

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) { }

  async signIn(
    username: string,
    pass: string,
    captchaResponse?: string,
    isAdmin: boolean = false,
  ): Promise<any> {
    // Check if the user has exceeded failed login attempts and needs CAPTCHA
    if (this.failedLoginAttempts[username] >= 3) {
      if (!captchaResponse || !(await this.validateCaptcha(captchaResponse))) {
        throw new BadRequestException('Invalid CAPTCHA');
      }
    }

    const user = await this.userService.findOneByUsername(username);

    if (!(user?.password && (await bcrypt.compare(pass, user.password)))) {
      // Increment failed login attempts on failure
      this.failedLoginAttempts[username] =
        (this.failedLoginAttempts[username] || 0) + 1;
      throw new BadRequestException('Invalid Login');
    }

    if (isAdmin && user.domain !== 2) {
      throw new BadRequestException('Unauthorized user domain.');
    }

    // Reset failed attempts on successful login
    this.failedLoginAttempts[username] = 0;

    const roles = user.userRoles?.map((r) => ({
      id: r.role?.id,
      name: r.role?.name,
    }));

    const payload = {
      id: user.id,
      username: user.username,
      domain: user.domain,
      roles: roles,
    };

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      token: await this.jwtService.signAsync(payload),
    };
  }

  // Validate CAPTCHA response with Google reCAPTCHA
  private async validateCaptcha(captchaResponse: string): Promise<boolean> {
    const secretKey = '6Ld_oI4qAAAAAGj3H4Y5SHs1pkk0-P9XUMKGD3zM'; // Replace with your secret key
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: captchaResponse,
        },
      },
    );

    return response.data.success;
  }

  async signUp(
    dto: CreateUserDto,
    domain: number,
    roleIds: number[],
  ): Promise<any> {
    const existingUser = await this.userService.findOneByUsername(dto.username);
    if (existingUser) throw new BadRequestException('Username already exists');

    // Assign domain and role to the user DTO
    const newUserDto = {
      ...dto,
      active: true,
      domain,
      roleIds,
    };

    return await this.userService.create(newUserDto);
  }

  // private generateOtp(): string {
  //   return Math.floor(100000 + Math.random() * 900000).toString();
  // }

  async sendOtp(username: string, type: 'login' | 'register') {
    const user = await this.userService.findOneByUsername(username);

    if (type === 'login') {
      if (!user) {
        throw new BadRequestException('کاربر یافت نشد');
      }
    }

    if (type === 'register') {
      if (user) {
        throw new BadRequestException('کاربری با این شماره همراه وجود دارد');
      }
    }

    const otp = await this.otpService.createOtp(username, type);

    await this.sendOtpSms(username, otp);

    return {
      message: 'رمز یکبار مصرف با موفقیت ارسال شد',
    };
  }

  async signUpWithOtp(dto: RegisterDto) {
    const validOtp = await this.otpService.verifyOtp(
      dto.username,
      dto.otp,
      'register',
    );

    if (!validOtp) {
      throw new BadRequestException('رمز یکبار مصرف اشتباه است');
    }

    await this.signUp(dto, 1, [1]);

    const user = await this.userService.findOneByUsername(dto.username);

    const roles = user.userRoles?.map((r) => ({
      id: r.role?.id,
      name: r.role?.name,
    }));

    const payload = {
      id: user.id,
      username: user.username,
      domain: user.domain,
      roles,
    };

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async signInOtp(username: string, otp: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException('Invalid Login');
    }

    const validOtp = await this.otpService.verifyOtp(
      username,
      otp,
      'login',
    );

    if (!validOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    const roles = user.userRoles?.map((r) => ({
      id: r.role?.id,
      name: r.role?.name,
    }));

    const payload = {
      id: user.id,
      username: user.username,
      domain: user.domain,
      roles,
    };

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      token: await this.jwtService.signAsync(payload),
    };
  }




  // helper for sending otp
  private async sendOtpSms(phone: string, otp: string): Promise<void> {
    try {
      await axios.post(
        'https://api.sms.ir/v1/send/verify',
        {
          mobile: phone,
          templateId: Number(process.env.SMS_IR_TEMPLATE_ID),
          parameters: [
            {
              name: 'Code',
              value: otp,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/plain',
            'x-api-key': process.env.SMS_IR_API_KEY,
          },
        },
      );
    } catch (error) {

      throw new BadRequestException('Failed to send OTP.');
    }
  }
}
