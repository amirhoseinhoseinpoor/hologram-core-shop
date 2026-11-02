import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from '../otp/otp.service';
import axios from 'axios';

const MIN_PASSWORD_LENGTH = 4;

@Injectable()
export class AuthService {
  private failedLoginAttempts: { [key: string]: number } = {};

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  // First login step (site and admin panel): checks the password and sends the
  // OTP. A token is only issued by signInOtp, after the OTP is confirmed.
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

    const otp = await this.otpService.createOtp(username, 'login');

    await this.sendOtpSms(username, otp);

    return {
      message: 'OTP sent successfully',
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

  // Public OTP request, registration only. Login OTPs are sent by signIn after
  // the password check; allowing them here would let the password be skipped.
  async sendOtp(username: string, type: string) {
    if (type !== 'register') {
      throw new BadRequestException('Invalid OTP type');
    }

    const user = await this.userService.findOneByUsername(username);

    if (user) {
      throw new BadRequestException('کاربری با این شماره همراه وجود دارد');
    }

    const otp = await this.otpService.createOtp(username, 'register');

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

    return this.buildSession(user);
  }

  async signInOtp(
    username: string,
    otp: string,
    isAdmin: boolean = false,
  ): Promise<any> {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException('Invalid Login');
    }

    if (isAdmin && user.domain !== 2) {
      throw new BadRequestException('Unauthorized user domain.');
    }

    const validOtp = await this.otpService.verifyOtp(username, otp, 'login');

    if (!validOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    return this.buildSession(user, isAdmin);
  }

  // The answer is the same for unknown numbers, so this can't be used to find
  // out who has an account.
  async forgotPassword(username: string) {
    const user = await this.userService.findOneByUsername(username);

    if (user) {
      const otp = await this.otpService.createOtp(username, 'reset');

      await this.sendOtpSms(username, otp);
    }

    return {
      message: 'رمز یکبار مصرف با موفقیت ارسال شد',
    };
  }

  async resetPassword(username: string, otp: string, password: string) {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException('Invalid password');
    }

    const validOtp = await this.otpService.verifyOtp(username, otp, 'reset');
    const user = validOtp
      ? await this.userService.findOneByUsername(username)
      : null;

    if (!user) {
      throw new BadRequestException('Invalid OTP');
    }

    return this.userService.update(user.code, { password });
  }

  // Long-lived sessions, so a refresh or a few days away doesn't force a new
  // password + OTP login.
  private async buildSession(user: any, isAdmin: boolean = false) {
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

    const expiresIn = ((isAdmin
      ? process.env.ADMIN_JWT_EXPIRES_IN
      : process.env.USER_JWT_EXPIRES_IN) || '7d') as JwtSignOptions['expiresIn'];

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      token: await this.jwtService.signAsync(payload, { expiresIn }),
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
