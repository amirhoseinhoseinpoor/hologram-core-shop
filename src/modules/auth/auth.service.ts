import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  private failedLoginAttempts: { [key: string]: number } = {};

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string, captchaResponse?: string, isAdmin: boolean = false): Promise<any> {
    // Check if the user has exceeded failed login attempts and needs CAPTCHA
    if (this.failedLoginAttempts[username] >= 3) {
      if (!captchaResponse || !(await this.validateCaptcha(captchaResponse))) {
        throw new BadRequestException('Invalid CAPTCHA');
      }
    }

    const user = await this.userService.findOneByUsername(username);
    if (!(user?.password && (await bcrypt.compare(pass, user.password)))) {
      // Increment failed login attempts on failure
      this.failedLoginAttempts[username] = (this.failedLoginAttempts[username] || 0) + 1;
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
    const secretKey = '6Ld_oI4qAAAAAGj3H4Y5SHs1pkk0-P9XUMKGD3zM';  // Replace with your secret key
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: captchaResponse,
      },
    });

    return response.data.success;
  }

  async signUp(dto: CreateUserDto, domain: number, roleIds: number[]): Promise<any> {
    const existingUser = await this.userService.findOneByUsername(dto.username);
    if (existingUser) throw new BadRequestException('Username already exists');

    // Assign domain and role to the user DTO
    const newUserDto = {
      ...dto,
      domain,
      roleIds,
    };

    return await this.userService.create(newUserDto);
  }
}
