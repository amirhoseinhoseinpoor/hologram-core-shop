import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { OtpRepository } from './otp.repository';
import { OtpCode } from 'src/core/db/entities/otp-codes.entity';

export type OtpType = 'login' | 'register' | 'reset';

const OTP_COOLDOWN_MS = 60 * 1000;
const OTP_LIFETIME_MS = 8 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

// OtpService is request-scoped (through OtpRepository), so the counter has to
// live outside the instance to survive between requests.
const failedVerifyAttempts = new Map<string, number>();

@Injectable()
export class OtpService {
  constructor(private otpRepository: OtpRepository) {}

  private generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  private attemptsKey(username: string, type: OtpType): string {
    return `${type}:${username}`;
  }

  async createOtp(username: string, type: OtpType): Promise<string> {
    const oldOtp = await this.otpRepository.findOne({
      username,
      type,
    });

    if (oldOtp && oldOtp.createdAt.getTime() + OTP_COOLDOWN_MS > Date.now()) {
      throw new BadRequestException(
        'Please wait before requesting another OTP.',
      );
    }

    // Delete previous OTPs for this user/type
    await this.otpRepository.delete({
      username,
      type,
    });

    // Delete expired OTPs
    await this.otpRepository.deleteExpired();

    const otp = this.generateOtp();

    const otpEntity = new OtpCode();
    otpEntity.username = username;
    otpEntity.type = type;

    // Store hashed OTP
    otpEntity.code = await bcrypt.hash(otp, 10);

    otpEntity.expiresAt = new Date(Date.now() + OTP_LIFETIME_MS);

    await this.otpRepository.createOrUpdate(otpEntity);
    failedVerifyAttempts.delete(this.attemptsKey(username, type));

    return otp;
  }

  async verifyOtp(
    username: string,
    otp: string,
    type: OtpType,
  ): Promise<boolean> {
    const storedOtp = await this.otpRepository.findOne({
      username,
      type,
    });

    if (!storedOtp) {
      return false;
    }

    if (storedOtp.expiresAt.getTime() < Date.now()) {
      await this.otpRepository.delete({
        id: storedOtp.id,
      });

      return false;
    }

    const key = this.attemptsKey(username, type);
    const valid = await bcrypt.compare(otp, storedOtp.code);

    if (!valid) {
      const attempts = (failedVerifyAttempts.get(key) ?? 0) + 1;

      if (attempts >= MAX_VERIFY_ATTEMPTS) {
        // Too many wrong guesses: this code is burned, a new one must be requested.
        failedVerifyAttempts.delete(key);
        await this.otpRepository.delete({
          id: storedOtp.id,
        });
      } else {
        failedVerifyAttempts.set(key, attempts);
      }

      return false;
    }

    failedVerifyAttempts.delete(key);
    await this.otpRepository.delete({
      id: storedOtp.id,
    });

    return true;
  }
}
